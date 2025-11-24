const express = require('express');
const router = express.Router();
const { query } = require('../services/database');
const { sendEmail } = require('../services/email');
const crypto = require('crypto');

// ============================================
// STRIPE WEBHOOKS
// ============================================

// Verify Stripe webhook signature
function verifyStripeWebhook(payload, signature, secret) {
  try {
    const elements = signature.split(',');
    let timestamp;
    let signatures = [];

    for (const element of elements) {
      const [key, value] = element.split('=');
      if (key === 't') {
        timestamp = value;
      } else if (key === 'v1') {
        signatures.push(value);
      }
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    return signatures.includes(expectedSignature);
  } catch (error) {
    return false;
  }
}

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  // Verify webhook signature
  const payload = req.body.toString();
  if (!verifyStripeWebhook(payload, signature, webhookSecret)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(payload);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful payment
async function handlePaymentSuccess(paymentIntent) {
  const { metadata } = paymentIntent;
  
  if (!metadata.order_id) {
    console.error('No order_id in payment metadata');
    return;
  }

  // Update order status
  await query(
    'UPDATE orders SET payment_status = $1, status = $2, paid_at = NOW() WHERE id = $3',
    ['completed', 'completed', metadata.order_id]
  );

  // Get order details
  const orderResult = await query(
    'SELECT * FROM orders WHERE id = $1',
    [metadata.order_id]
  );

  if (orderResult.rows.length > 0) {
    const order = orderResult.rows[0];
    
    // Generate license key
    const licenseKey = generateLicenseKey();
    
    // Create license
    await query(`
      INSERT INTO licenses (
        license_key, order_id, product_id, user_id, 
        license_type, status, max_domains
      ) VALUES ($1, $2, $3, $4, $5, 'active', $6)
    `, [
      licenseKey,
      order.id,
      order.product_id,
      order.user_id,
      order.license_type,
      order.license_type === 'extended' ? 5 : 1
    ]);

    // Send confirmation email
    const userResult = await query(
      'SELECT * FROM users WHERE id = $1',
      [order.user_id]
    );

    if (userResult.rows.length > 0) {
      await sendEmail({
        to: userResult.rows[0].email,
        subject: `Order Confirmation - ${order.order_number}`,
        template: 'order_confirmation',
        data: {
          user_name: userResult.rows[0].name,
          order_number: order.order_number,
          license_key: licenseKey,
          total_amount: order.total_amount
        }
      });
    }
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent) {
  const { metadata } = paymentIntent;
  
  if (!metadata.order_id) {
    return;
  }

  // Update order status
  await query(
    'UPDATE orders SET payment_status = $1, status = $2 WHERE id = $3',
    ['failed', 'cancelled', metadata.order_id]
  );
}

// Handle subscription created
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  // Implement subscription logic if needed
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  // Implement subscription update logic if needed
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  // Implement subscription cancellation logic if needed
}

// ============================================
// PAYPAL WEBHOOKS
// ============================================

router.post('/paypal', async (req, res) => {
  // TODO: Implement PayPal webhook handling
  res.json({ received: true });
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
