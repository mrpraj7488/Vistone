/*
  # Create Software Marketplace Schema

  ## Overview
  Complete database schema for a single-vendor software marketplace platform
  with products, orders, reviews, licenses, and user management.

  ## New Tables

  ### 1. Categories
    - `id` (uuid, primary key)
    - `name` (text, unique)
    - `slug` (text, unique)
    - `parent_id` (uuid, nullable - for subcategories)
    - `description` (text)
    - `icon` (text)
    - `created_at` (timestamptz)

  ### 2. Technologies
    - `id` (uuid, primary key)
    - `name` (text, unique)
    - `color` (text - hex color for pills)
    - `created_at` (timestamptz)

  ### 3. Products
    - `id` (uuid, primary key)
    - `name` (text)
    - `slug` (text, unique)
    - `tagline` (text)
    - `description` (text)
    - `category_id` (uuid, foreign key)
    - `price_monthly` (decimal)
    - `price_yearly` (decimal)
    - `featured_image` (text - URL)
    - `images` (jsonb - array of image URLs)
    - `demo_url` (text, nullable)
    - `video_url` (text, nullable)
    - `is_featured` (boolean, default false)
    - `is_popular` (boolean, default false)
    - `is_new` (boolean, default false)
    - `rating_average` (decimal, default 0)
    - `rating_count` (integer, default 0)
    - `sales_count` (integer, default 0)
    - `stock_status` (text, default 'in_stock')
    - `version` (text)
    - `file_size` (text)
    - `requirements` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 4. Product Technologies (Junction Table)
    - `product_id` (uuid, foreign key)
    - `technology_id` (uuid, foreign key)
    - Composite primary key

  ### 5. Product Features
    - `id` (uuid, primary key)
    - `product_id` (uuid, foreign key)
    - `title` (text)
    - `description` (text)
    - `icon` (text)
    - `created_at` (timestamptz)

  ### 6. Orders
    - `id` (uuid, primary key)
    - `order_number` (text, unique)
    - `user_id` (uuid, foreign key to auth.users)
    - `email` (text)
    - `status` (text - pending, completed, cancelled, refunded)
    - `subtotal` (decimal)
    - `discount` (decimal, default 0)
    - `tax` (decimal, default 0)
    - `total` (decimal)
    - `billing_details` (jsonb)
    - `payment_method` (text)
    - `payment_status` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 7. Order Items
    - `id` (uuid, primary key)
    - `order_id` (uuid, foreign key)
    - `product_id` (uuid, foreign key)
    - `quantity` (integer)
    - `license_type` (text - single, multi)
    - `price` (decimal)
    - `created_at` (timestamptz)

  ### 8. Reviews
    - `id` (uuid, primary key)
    - `product_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key to auth.users)
    - `order_id` (uuid, foreign key, nullable)
    - `rating` (integer, 1-5)
    - `title` (text)
    - `content` (text)
    - `images` (jsonb, nullable)
    - `is_verified_purchase` (boolean, default false)
    - `helpful_count` (integer, default 0)
    - `unhelpful_count` (integer, default 0)
    - `vendor_reply` (text, nullable)
    - `vendor_replied_at` (timestamptz, nullable)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 9. Licenses
    - `id` (uuid, primary key)
    - `order_item_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key to auth.users)
    - `product_id` (uuid, foreign key)
    - `license_key` (text, unique)
    - `license_type` (text)
    - `status` (text - active, expired, cancelled)
    - `activated_domains` (jsonb, array)
    - `expires_at` (timestamptz, nullable)
    - `created_at` (timestamptz)

  ### 10. Wishlist
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to auth.users)
    - `product_id` (uuid, foreign key)
    - `notify_price_drop` (boolean, default false)
    - `created_at` (timestamptz)
    - Unique constraint on (user_id, product_id)

  ### 11. Cart
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to auth.users, nullable)
    - `session_id` (text, nullable - for guest carts)
    - `product_id` (uuid, foreign key)
    - `quantity` (integer, default 1)
    - `license_type` (text, default 'single')
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 12. Blog Posts
    - `id` (uuid, primary key)
    - `title` (text)
    - `slug` (text, unique)
    - `excerpt` (text)
    - `content` (text)
    - `featured_image` (text)
    - `category` (text)
    - `tags` (jsonb, array)
    - `author_id` (uuid, foreign key to auth.users)
    - `read_time` (integer - minutes)
    - `views` (integer, default 0)
    - `published_at` (timestamptz)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 13. Testimonials
    - `id` (uuid, primary key)
    - `name` (text)
    - `role` (text)
    - `company` (text, nullable)
    - `avatar` (text)
    - `rating` (integer, 1-5)
    - `content` (text)
    - `product_id` (uuid, foreign key, nullable)
    - `is_featured` (boolean, default false)
    - `created_at` (timestamptz)

  ### 14. FAQ
    - `id` (uuid, primary key)
    - `product_id` (uuid, foreign key, nullable)
    - `question` (text)
    - `answer` (text)
    - `category` (text)
    - `order_index` (integer, default 0)
    - `created_at` (timestamptz)

  ### 15. Support Tickets
    - `id` (uuid, primary key)
    - `ticket_number` (text, unique)
    - `user_id` (uuid, foreign key to auth.users)
    - `subject` (text)
    - `category` (text)
    - `status` (text - open, in_progress, closed)
    - `priority` (text - low, medium, high)
    - `order_number` (text, nullable)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 16. Support Messages
    - `id` (uuid, primary key)
    - `ticket_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key to auth.users)
    - `message` (text)
    - `attachments` (jsonb, nullable)
    - `is_staff_reply` (boolean, default false)
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Create restrictive policies for authenticated users
  - Public read access for products, categories, reviews (with limitations)
*/

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text DEFAULT '',
  icon text DEFAULT '📦',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Technologies Table
CREATE TABLE IF NOT EXISTS technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view technologies"
  ON technologies FOR SELECT
  TO public
  USING (true);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text DEFAULT '',
  description text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price_monthly decimal(10,2) DEFAULT 0,
  price_yearly decimal(10,2) DEFAULT 0,
  featured_image text DEFAULT '',
  images jsonb DEFAULT '[]'::jsonb,
  demo_url text,
  video_url text,
  is_featured boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  is_new boolean DEFAULT false,
  rating_average decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  sales_count integer DEFAULT 0,
  stock_status text DEFAULT 'in_stock',
  version text DEFAULT '1.0.0',
  file_size text DEFAULT '10MB',
  requirements text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Product Technologies Junction Table
CREATE TABLE IF NOT EXISTS product_technologies (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, technology_id)
);

ALTER TABLE product_technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product technologies"
  ON product_technologies FOR SELECT
  TO public
  USING (true);

-- Product Features Table
CREATE TABLE IF NOT EXISTS product_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '✓',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product features"
  ON product_features FOR SELECT
  TO public
  USING (true);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  status text DEFAULT 'pending',
  subtotal decimal(10,2) NOT NULL,
  discount decimal(10,2) DEFAULT 0,
  tax decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  billing_details jsonb DEFAULT '{}'::jsonb,
  payment_method text DEFAULT 'card',
  payment_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer DEFAULT 1,
  license_type text DEFAULT 'single',
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  is_verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  unhelpful_count integer DEFAULT 0,
  vendor_reply text,
  vendor_replied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid REFERENCES order_items(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  license_key text UNIQUE NOT NULL,
  license_type text DEFAULT 'single',
  status text DEFAULT 'active',
  activated_domains jsonb DEFAULT '[]'::jsonb,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own licenses"
  ON licenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  notify_price_drop boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON wishlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to wishlist"
  ON wishlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from wishlist"
  ON wishlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  license_type text DEFAULT 'single',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart"
  ON cart FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  featured_image text DEFAULT '',
  category text DEFAULT 'General',
  tags jsonb DEFAULT '[]'::jsonb,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  read_time integer DEFAULT 5,
  views integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published_at <= now());

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  company text,
  avatar text DEFAULT '👤',
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (true);

-- FAQ Table
CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'General',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQ"
  ON faq FOR SELECT
  TO public
  USING (true);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  category text DEFAULT 'general',
  status text DEFAULT 'open',
  priority text DEFAULT 'medium',
  order_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Support Messages Table
CREATE TABLE IF NOT EXISTS support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_staff_reply boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for own tickets"
  ON support_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = support_messages.ticket_id
      AND support_tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages for own tickets"
  ON support_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = ticket_id
      AND support_tickets.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating_average DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published_at DESC);
