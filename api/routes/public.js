const express = require('express');
const router = express.Router();
const { query } = require('../services/database');
const { optionalAuth } = require('../middleware/auth');
const { trackEvent, trackProductView } = require('../services/analytics');
const { validateEmail, validateRequired } = require('../utils/validation');
const { sendEmail } = require('../services/email');
const rateLimit = require('express-rate-limit');

// ============================================
// RATE LIMITING
// ============================================

const searchLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: 'Too many search requests, please try again later.'
});

const contactLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 contact form submissions per 15 minutes
  message: 'Too many contact form submissions, please try again later.'
});

// ============================================
// PRODUCTS API
// ============================================

// Get all products with filters
router.get('/products', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      tag,
      search,
      sort = 'created_at',
      order = 'desc',
      page = 1,
      limit = 12,
      featured,
      trending,
      price_min,
      price_max
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ["p.status = 'published'"];
    let queryParams = [];
    let paramCount = 0;

    // Build WHERE conditions
    if (category) {
      paramCount++;
      whereConditions.push(`c.slug = $${paramCount}`);
      queryParams.push(category);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(p.name ILIKE $${paramCount} OR p.short_description ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (featured === 'true') {
      whereConditions.push('p.is_featured = true');
    }

    if (trending === 'true') {
      whereConditions.push('p.is_trending = true');
    }

    if (price_min) {
      paramCount++;
      whereConditions.push(`p.regular_price >= $${paramCount}`);
      queryParams.push(parseFloat(price_min));
    }

    if (price_max) {
      paramCount++;
      whereConditions.push(`p.regular_price <= $${paramCount}`);
      queryParams.push(parseFloat(price_max));
    }

    // Build ORDER BY clause
    const validSortFields = ['created_at', 'name', 'regular_price', 'sales_count', 'rating_average'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const baseQuery = `
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereConditions.join(' AND ')}
    `;

    // Get total count
    const countResult = await query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get products
    paramCount++;
    queryParams.push(limit);
    paramCount++;
    queryParams.push(offset);

    const productsResult = await query(`
      SELECT 
        p.id, p.name, p.slug, p.short_description, p.featured_image,
        p.regular_price, p.extended_price, p.sale_price,
        p.sale_start_date, p.sale_end_date, p.version,
        p.is_featured, p.is_trending, p.rating_average, p.rating_count,
        p.sales_count, p.created_at,
        c.name as category_name, c.slug as category_slug,
        COALESCE(
          json_agg(
            json_build_object('name', pt.name, 'slug', pt.slug)
          ) FILTER (WHERE pt.id IS NOT NULL), 
          '[]'
        ) as tags
      ${baseQuery}
      LEFT JOIN product_tag_relations ptr ON p.id = ptr.product_id
      LEFT JOIN product_tags pt ON ptr.tag_id = pt.id
      GROUP BY p.id, c.name, c.slug
      ORDER BY p.${sortField} ${sortOrder}
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, queryParams);

    // Calculate current price for each product
    const products = productsResult.rows.map(product => {
      const now = new Date();
      const saleActive = product.sale_price && 
        (!product.sale_start_date || new Date(product.sale_start_date) <= now) &&
        (!product.sale_end_date || new Date(product.sale_end_date) >= now);

      return {
        ...product,
        current_price: saleActive ? product.sale_price : product.regular_price,
        on_sale: saleActive
      };
    });

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product by slug
router.get('/products/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const productResult = await query(`
      SELECT 
        p.*, 
        c.name as category_name, c.slug as category_slug,
        COALESCE(
          json_agg(
            json_build_object('name', pt.name, 'slug', pt.slug)
          ) FILTER (WHERE pt.id IS NOT NULL), 
          '[]'
        ) as tags
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_tag_relations ptr ON p.id = ptr.product_id
      LEFT JOIN product_tags pt ON ptr.tag_id = pt.id
      WHERE p.slug = $1 AND p.status = 'published'
      GROUP BY p.id, c.name, c.slug
    `, [slug]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Calculate current price
    const now = new Date();
    const saleActive = product.sale_price && 
      (!product.sale_start_date || new Date(product.sale_start_date) <= now) &&
      (!product.sale_end_date || new Date(product.sale_end_date) >= now);

    product.current_price = saleActive ? product.sale_price : product.regular_price;
    product.on_sale = saleActive;

    // Track product view
    await trackProductView(product.id, req.user?.id, req.sessionID, req.ip, req.get('Referer'));

    // Update view count
    await query('UPDATE products SET views_count = views_count + 1 WHERE id = $1', [product.id]);

    res.json({ product });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get related products
router.get('/products/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    const relatedResult = await query(`
      SELECT 
        p.id, p.name, p.slug, p.short_description, p.featured_image,
        p.regular_price, p.extended_price, p.sale_price,
        p.sale_start_date, p.sale_end_date, p.rating_average, p.rating_count,
        c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id != $1 
        AND p.status = 'published'
        AND p.category_id = (SELECT category_id FROM products WHERE id = $1)
      ORDER BY p.sales_count DESC, p.rating_average DESC
      LIMIT $2
    `, [id, limit]);

    const relatedProducts = relatedResult.rows.map(product => {
      const now = new Date();
      const saleActive = product.sale_price && 
        (!product.sale_start_date || new Date(product.sale_start_date) <= now) &&
        (!product.sale_end_date || new Date(product.sale_end_date) >= now);

      return {
        ...product,
        current_price: saleActive ? product.sale_price : product.regular_price,
        on_sale: saleActive
      };
    });

    res.json({ products: relatedProducts });

  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured products
router.get('/products/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const featuredResult = await query(`
      SELECT 
        p.id, p.name, p.slug, p.short_description, p.featured_image,
        p.regular_price, p.extended_price, p.sale_price,
        p.sale_start_date, p.sale_end_date, p.rating_average, p.rating_count,
        c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = true AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT $1
    `, [limit]);

    const featuredProducts = featuredResult.rows.map(product => {
      const now = new Date();
      const saleActive = product.sale_price && 
        (!product.sale_start_date || new Date(product.sale_start_date) <= now) &&
        (!product.sale_end_date || new Date(product.sale_end_date) >= now);

      return {
        ...product,
        current_price: saleActive ? product.sale_price : product.regular_price,
        on_sale: saleActive
      };
    });

    res.json({ products: featuredProducts });

  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get trending products
router.get('/products/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const trendingResult = await query(`
      SELECT 
        p.id, p.name, p.slug, p.short_description, p.featured_image,
        p.regular_price, p.extended_price, p.sale_price,
        p.sale_start_date, p.sale_end_date, p.rating_average, p.rating_count,
        c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_trending = true AND p.status = 'published'
      ORDER BY p.sales_count DESC, p.views_count DESC
      LIMIT $1
    `, [limit]);

    const trendingProducts = trendingResult.rows.map(product => {
      const now = new Date();
      const saleActive = product.sale_price && 
        (!product.sale_start_date || new Date(product.sale_start_date) <= now) &&
        (!product.sale_end_date || new Date(product.sale_end_date) >= now);

      return {
        ...product,
        current_price: saleActive ? product.sale_price : product.regular_price,
        on_sale: saleActive
      };
    });

    res.json({ products: trendingProducts });

  } catch (error) {
    console.error('Error fetching trending products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Track product view
router.post('/products/:id/view', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    await trackProductView(id, req.user?.id, req.sessionID, req.ip, req.get('Referer'));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking product view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// CATEGORIES API
// ============================================

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categoriesResult = await query(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'published'
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.name ASC
    `);

    res.json({ categories: categoriesResult.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get category with products
router.get('/categories/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    // Get category
    const categoryResult = await query(`
      SELECT * FROM categories WHERE slug = $1 AND is_active = true
    `, [slug]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = categoryResult.rows[0];

    // Get products in category
    const productsResult = await query(`
      SELECT 
        p.id, p.name, p.slug, p.short_description, p.featured_image,
        p.regular_price, p.extended_price, p.sale_price,
        p.sale_start_date, p.sale_end_date, p.rating_average, p.rating_count,
        p.sales_count, p.created_at
      FROM products p
      WHERE p.category_id = $1 AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `, [category.id, limit, offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total FROM products 
      WHERE category_id = $1 AND status = 'published'
    `, [category.id]);

    const total = parseInt(countResult.rows[0].total);

    const products = productsResult.rows.map(product => {
      const now = new Date();
      const saleActive = product.sale_price && 
        (!product.sale_start_date || new Date(product.sale_start_date) <= now) &&
        (!product.sale_end_date || new Date(product.sale_end_date) >= now);

      return {
        ...product,
        current_price: saleActive ? product.sale_price : product.regular_price,
        on_sale: saleActive
      };
    });

    res.json({
      category,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// SEARCH API
// ============================================

router.get('/search', searchLimit, optionalAuth, async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 12 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchTerm = q.trim();
    const offset = (page - 1) * limit;

    let results = {};

    if (type === 'all' || type === 'products') {
      const productsResult = await query(`
        SELECT 
          p.id, p.name, p.slug, p.short_description, p.featured_image,
          p.regular_price, p.extended_price, p.sale_price,
          p.sale_start_date, p.sale_end_date, p.rating_average, p.rating_count,
          c.name as category_name, c.slug as category_slug,
          ts_rank(to_tsvector('english', p.name || ' ' || p.short_description), plainto_tsquery('english', $1)) as rank
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'published' 
          AND (
            to_tsvector('english', p.name || ' ' || p.short_description) @@ plainto_tsquery('english', $1)
            OR p.name ILIKE $2
            OR p.short_description ILIKE $2
          )
        ORDER BY rank DESC, p.sales_count DESC
        LIMIT $3 OFFSET $4
      `, [searchTerm, `%${searchTerm}%`, limit, offset]);

      results.products = productsResult.rows.map(product => {
        const now = new Date();
        const saleActive = product.sale_price && 
          (!product.sale_start_date || new Date(product.sale_start_date) <= now) &&
          (!product.sale_end_date || new Date(product.sale_end_date) >= now);

        return {
          ...product,
          current_price: saleActive ? product.sale_price : product.regular_price,
          on_sale: saleActive
        };
      });
    }

    if (type === 'all' || type === 'blog') {
      const blogResult = await query(`
        SELECT 
          id, title, slug, excerpt, featured_image, published_at,
          ts_rank(to_tsvector('english', title || ' ' || excerpt), plainto_tsquery('english', $1)) as rank
        FROM blog_posts
        WHERE status = 'published' 
          AND (
            to_tsvector('english', title || ' ' || excerpt) @@ plainto_tsquery('english', $1)
            OR title ILIKE $2
            OR excerpt ILIKE $2
          )
        ORDER BY rank DESC, published_at DESC
        LIMIT $3
      `, [searchTerm, `%${searchTerm}%`, 5]);

      results.blog_posts = blogResult.rows;
    }

    // Track search event
    await trackEvent('search', req.user?.id, req.sessionID, {
      query: searchTerm,
      type,
      results_count: (results.products?.length || 0) + (results.blog_posts?.length || 0)
    }, req);

    res.json({
      query: searchTerm,
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// REVIEWS API
// ============================================

// Get product reviews
router.get('/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = 'created_at' } = req.query;
    const offset = (page - 1) * limit;

    const reviewsResult = await query(`
      SELECT 
        r.id, r.rating, r.title, r.content, r.pros, r.cons,
        r.is_verified_purchase, r.helpful_count, r.not_helpful_count,
        r.admin_reply, r.created_at,
        u.name as user_name, u.avatar as user_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1 AND r.status = 'approved'
      ORDER BY r.${sort === 'helpful' ? 'helpful_count' : 'created_at'} DESC
      LIMIT $2 OFFSET $3
    `, [id, limit, offset]);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM reviews 
      WHERE product_id = $1 AND status = 'approved'
    `, [id]);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      reviews: reviewsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// BLOG API
// ============================================

// Get blog posts
router.get('/blog/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereCondition = "bp.status = 'published'";
    let queryParams = [limit, offset];
    let paramCount = 2;

    if (category) {
      paramCount++;
      whereCondition += ` AND c.slug = $${paramCount}`;
      queryParams.push(category);
    }

    const postsResult = await query(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image,
        bp.views_count, bp.likes_count, bp.comments_count, bp.published_at,
        u.name as author_name, u.avatar as author_avatar,
        c.name as category_name, c.slug as category_slug
      FROM blog_posts bp
      JOIN users u ON bp.author_id = u.id
      LEFT JOIN categories c ON bp.category_id = c.id
      WHERE ${whereCondition}
      ORDER BY bp.published_at DESC
      LIMIT $1 OFFSET $2
    `, queryParams);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM blog_posts bp
      LEFT JOIN categories c ON bp.category_id = c.id
      WHERE ${whereCondition}
    `, queryParams.slice(2));

    const total = parseInt(countResult.rows[0].total);

    res.json({
      posts: postsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single blog post
router.get('/blog/posts/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const postResult = await query(`
      SELECT 
        bp.*,
        u.name as author_name, u.avatar as author_avatar,
        c.name as category_name, c.slug as category_slug
      FROM blog_posts bp
      JOIN users u ON bp.author_id = u.id
      LEFT JOIN categories c ON bp.category_id = c.id
      WHERE bp.slug = $1 AND bp.status = 'published'
    `, [slug]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const post = postResult.rows[0];

    // Update view count
    await query('UPDATE blog_posts SET views_count = views_count + 1 WHERE id = $1', [post.id]);

    // Track blog view
    await trackEvent('blog_view', req.user?.id, req.sessionID, {
      post_id: post.id,
      post_title: post.title
    }, req);

    res.json({ post });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get blog categories
router.get('/blog/categories', async (req, res) => {
  try {
    const categoriesResult = await query(`
      SELECT 
        c.id, c.name, c.slug,
        COUNT(bp.id) as post_count
      FROM categories c
      LEFT JOIN blog_posts bp ON c.id = bp.category_id AND bp.status = 'published'
      WHERE c.is_active = true
      GROUP BY c.id
      HAVING COUNT(bp.id) > 0
      ORDER BY c.name ASC
    `);

    res.json({ categories: categoriesResult.rows });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PAGES API
// ============================================

// Get page by slug
router.get('/pages/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const pageResult = await query(`
      SELECT * FROM pages WHERE slug = $1 AND is_active = true
    `, [slug]);

    if (pageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ page: pageResult.rows[0] });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// CONTACT API
// ============================================

// Submit contact form
router.post('/contact', contactLimit, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!validateRequired(name) || !validateRequired(subject) || !validateRequired(message)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Send email to admin
    await sendEmail({
      to: process.env.CONTACT_EMAIL || 'admin@vistone.com',
      subject: `Contact Form: ${subject}`,
      template: 'contact_form',
      data: {
        name,
        email,
        subject,
        message,
        ip: req.ip,
        timestamp: new Date().toISOString()
      }
    });

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'Thank you for contacting us',
      template: 'contact_confirmation',
      data: {
        name,
        subject
      }
    });

    // Track contact event
    await trackEvent('contact_form_submit', null, req.sessionID, {
      subject,
      email
    }, req);

    res.json({ message: 'Thank you for your message. We will get back to you soon!' });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// ============================================
// NEWSLETTER API
// ============================================

// Subscribe to newsletter
router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if already subscribed
    const existingResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    // Add to newsletter list (you might want to use a dedicated newsletter service)
    // For now, we'll just send a welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to Vistone Newsletter',
      template: 'newsletter_welcome',
      data: {
        name: name || 'Subscriber'
      }
    });

    // Track newsletter signup
    await trackEvent('newsletter_subscribe', null, req.sessionID, {
      email,
      name
    }, req);

    res.json({ message: 'Successfully subscribed to newsletter!' });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe. Please try again later.' });
  }
});

// ============================================
// SETTINGS API (Public settings only)
// ============================================

// Get public settings
router.get('/settings', async (req, res) => {
  try {
    const settingsResult = await query(`
      SELECT setting_key, setting_value, setting_type
      FROM settings 
      WHERE is_public = true
    `);

    const settings = {};
    settingsResult.rows.forEach(row => {
      let value = row.setting_value;
      
      // Convert based on type
      if (row.setting_type === 'boolean') {
        value = value === 'true';
      } else if (row.setting_type === 'number') {
        value = parseFloat(value);
      } else if (row.setting_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = null;
        }
      }
      
      settings[row.setting_key] = value;
    });

    res.json({ settings });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
