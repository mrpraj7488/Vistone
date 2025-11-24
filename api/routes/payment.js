const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { query } = require('../services/database');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { sendEmail } = require('../services/email');
const { trackEvent } = require('../services/analytics');

// Initialize PayPal
const paypalEnvironment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================
// PAYPAL INTEGRATION
// ============================================

// Create PayPal order
router.post('/paypal/create-order', authenticate, async (req, res) => {
  try {
    const { items, total_amount, currency = 'USD' } = req.body;
    const userId = req.user.id;

    // Create order in database
    const orderResult = await query(`
      INSERT INTO orders (user_id, total_amount, currency, status, payment_method)
      VALUES ($1, $2, $3, 'pending', 'paypal')
      RETURNING *
    `, [userId, total_amount, currency]);

    const order = orderResult.rows[0];

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: order.id.toString(),
        amount: {
          currency_code: currency,
          value: total_amount.toFixed(2)
        },
        description: `Order #${order.order_number}`
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/checkout/success`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`
      }
    });

    const paypalOrder = await paypalClient.execute(request);

    // Update order with PayPal order ID
    await query(
      'UPDATE orders SET payment_intent_id = $1 WHERE id = $2',
      [paypalOrder.result.id, order.id]
    );

    res.json({
      order_id: order.id,
      paypal_order_id: paypalOrder.result.id,
      approval_url: paypalOrder.result.links.find(link => link.rel === 'approve').href
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// Capture PayPal payment
router.post('/paypal/capture/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    if (capture.result.status === 'COMPLETED') {
      // Update order status
      const orderResult = await query(
        'UPDATE orders SET status = $1, paid_at = NOW() WHERE payment_intent_id = $2 RETURNING *',
        ['completed', orderId]
      );

      if (orderResult.rows.length > 0) {
        const order = orderResult.rows[0];
        
        // Generate license key
        const licenseKey = generateLicenseKey();
        
        // Create license
        await query(`
          INSERT INTO licenses (
            license_key, order_id, user_id, status, max_domains
          ) VALUES ($1, $2, $3, 'active', 1)
        `, [licenseKey, order.id, order.user_id]);

        // Send confirmation email
        await sendEmail({
          to: req.user.email,
          subject: `Payment Confirmed - Order #${order.order_number}`,
          template: 'payment_confirmation',
          data: {
            user_name: req.user.name,
            order_number: order.order_number,
            license_key: licenseKey,
            total_amount: order.total_amount
          }
        });

        res.json({
          success: true,
          order: order,
          license_key: licenseKey
        });
      }
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }

  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ error: 'Failed to capture PayPal payment' });
  }
});

// ============================================
// RAZORPAY INTEGRATION
// ============================================

// Create Razorpay order
router.post('/razorpay/create-order', authenticate, async (req, res) => {
  try {
    const { items, total_amount, currency = 'INR' } = req.body;
    const userId = req.user.id;

    // Create order in database
    const orderResult = await query(`
      INSERT INTO orders (user_id, total_amount, currency, status, payment_method)
      VALUES ($1, $2, $3, 'pending', 'razorpay')
      RETURNING *
    `, [userId, total_amount, currency]);

    const order = orderResult.rows[0];

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total_amount * 100), // Amount in paise
      currency: currency,
      receipt: order.order_number,
      notes: {
        order_id: order.id,
        user_id: userId
      }
    });

    // Update order with Razorpay order ID
    await query(
      'UPDATE orders SET payment_intent_id = $1 WHERE id = $2',
      [razorpayOrder.id, order.id]
    );

    res.json({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Update order status
    const orderResult = await query(
      'UPDATE orders SET status = $1, paid_at = NOW(), payment_id = $2 WHERE payment_intent_id = $3 RETURNING *',
      ['completed', razorpay_payment_id, razorpay_order_id]
    );

    if (orderResult.rows.length > 0) {
      const order = orderResult.rows[0];
      
      // Generate license key
      const licenseKey = generateLicenseKey();
      
      // Create license
      await query(`
        INSERT INTO licenses (
          license_key, order_id, user_id, status, max_domains
        ) VALUES ($1, $2, $3, 'active', 1)
      `, [licenseKey, order.id, order.user_id]);

      // Send confirmation email
      await sendEmail({
        to: req.user.email,
        subject: `Payment Confirmed - Order #${order.order_number}`,
        template: 'payment_confirmation',
        data: {
          user_name: req.user.name,
          order_number: order.order_number,
          license_key: licenseKey,
          total_amount: order.total_amount
        }
      });

      res.json({
        success: true,
        order: order,
        license_key: licenseKey
      });
    }

  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({ error: 'Failed to verify Razorpay payment' });
  }
});

// ============================================
// CART MANAGEMENT
// ============================================

// Add item to cart
router.post('/cart/add', optionalAuth, async (req, res) => {
  try {
    const { product_id, license_type = 'regular', quantity = 1 } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      // Handle guest cart (store in session or return for frontend storage)
      return res.json({ message: 'Item added to guest cart', guest: true });
    }

    // Check if item already exists in cart
    const existingItem = await query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2 AND license_type = $3',
      [userId, product_id, license_type]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      await query(
        'UPDATE cart_items SET quantity = quantity + $1, updated_at = NOW() WHERE id = $2',
        [quantity, existingItem.rows[0].id]
      );
    } else {
      // Add new item
      await query(
        'INSERT INTO cart_items (user_id, product_id, license_type, quantity) VALUES ($1, $2, $3, $4)',
        [userId, product_id, license_type, quantity]
      );
    }

    // Get updated cart
    const cartItems = await query(`
      SELECT ci.*, p.name, p.regular_price, p.extended_price, p.featured_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `, [userId]);

    res.json({ cart_items: cartItems.rows });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Get cart items
router.get('/cart', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await query(`
      SELECT 
        ci.*,
        p.name,
        p.regular_price,
        p.extended_price,
        p.featured_image,
        p.slug
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at DESC
    `, [userId]);

    res.json({ cart_items: cartItems.rows });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart items' });
  }
});

// Remove item from cart
router.delete('/cart/:itemId', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    await query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
      [itemId, userId]
    );

    res.json({ message: 'Item removed from cart' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/cart', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    res.json({ message: 'Cart cleared' });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// ============================================
// COUPON MANAGEMENT
// ============================================

// Apply coupon
router.post('/coupon/apply', optionalAuth, async (req, res) => {
  try {
    const { coupon_code, total_amount } = req.body;

    const couponResult = await query(
      'SELECT * FROM coupons WHERE code = $1 AND status = "active" AND (expires_at IS NULL OR expires_at > NOW())',
      [coupon_code]
    );

    if (couponResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    const coupon = couponResult.rows[0];

    // Check usage limits
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }

    // Check minimum amount
    if (coupon.minimum_amount && total_amount < coupon.minimum_amount) {
      return res.status(400).json({ 
        error: `Minimum order amount of $${coupon.minimum_amount} required` 
      });
    }

    // Calculate discount
    let discount_amount = 0;
    if (coupon.discount_type === 'percentage') {
      discount_amount = (total_amount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discount_amount = Math.min(discount_amount, coupon.max_discount_amount);
      }
    } else {
      discount_amount = coupon.discount_value;
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discount_amount
      }
    });

  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateLicenseKey() {
  const prefix = 'LIC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random1 = crypto.randomBytes(4).toString('hex').toUpperCase();
  const random2 = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random1}-${random2}`;
}

module.exports = router;
