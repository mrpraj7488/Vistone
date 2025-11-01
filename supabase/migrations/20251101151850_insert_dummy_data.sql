/*
  # Insert Dummy Data

  Adds sample categories, technologies, products with features for testing the marketplace.
  All data is publicly readable and doesn't require authentication.
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Web Development', 'web-development', 'Tools for building and designing websites', '🌐'),
  ('Mobile Apps', 'mobile-apps', 'Mobile application development tools', '📱'),
  ('UI Kits', 'ui-kits', 'Design components and UI frameworks', '🎨'),
  ('Backend Tools', 'backend-tools', 'Server and backend development tools', '⚙️'),
  ('Analytics', 'analytics', 'Data analysis and tracking tools', '📊')
ON CONFLICT DO NOTHING;

-- Insert Technologies
INSERT INTO technologies (name, color) VALUES
  ('React', '#61DAFB'),
  ('Vue.js', '#4FC08D'),
  ('Angular', '#DD0031'),
  ('Node.js', '#339933'),
  ('Python', '#3776AB'),
  ('TypeScript', '#3178C6'),
  ('TailwindCSS', '#06B6D4'),
  ('GraphQL', '#E10098'),
  ('PostgreSQL', '#336791'),
  ('MongoDB', '#13AA52')
ON CONFLICT (name) DO NOTHING;

-- Insert Products with all required fields
INSERT INTO products (name, slug, tagline, description, category_id, price_monthly, price_yearly, featured_image, images, is_featured, is_popular, is_new, rating_average, rating_count, sales_count, version, file_size, requirements) VALUES
  (
    'React Dashboard Pro',
    'react-dashboard-pro',
    'Premium React admin dashboard template with 50+ components',
    'Complete React-based admin dashboard with authentication, data visualization, and responsive design. Includes dark mode, 50+ pre-built components, and comprehensive documentation.',
    (SELECT id FROM categories WHERE slug = 'web-development' LIMIT 1),
    49.99,
    499.99,
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500',
    '["https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500", "https://images.pexels.com/photos/3861970/pexels-photo-3861970.jpeg?auto=compress&cs=tinysrgb&w=500"]',
    true,
    true,
    false,
    4.8,
    245,
    1250,
    '3.5.0',
    '15MB',
    'Node.js 14+, React 18+, npm or yarn'
  ),
  (
    'Vue UI Component Library',
    'vue-ui-component-library',
    'Comprehensive Vue 3 component library with 100+ components',
    'Feature-rich component library for Vue 3 with TypeScript support, Storybook integration, and extensive documentation. Perfect for building beautiful web applications.',
    (SELECT id FROM categories WHERE slug = 'ui-kits' LIMIT 1),
    29.99,
    279.99,
    'https://images.pexels.com/photos/374632/pexels-photo-374632.jpeg?auto=compress&cs=tinysrgb&w=500',
    '["https://images.pexels.com/photos/374632/pexels-photo-374632.jpeg?auto=compress&cs=tinysrgb&w=500"]',
    true,
    false,
    true,
    4.9,
    189,
    856,
    '2.1.0',
    '8MB',
    'Vue 3+, Node.js 12+'
  ),
  (
    'Mobile App Starter Kit',
    'mobile-app-starter-kit',
    'React Native and Flutter starter templates',
    'Complete starter kits for both React Native and Flutter with authentication, API integration, and UI templates. Build production-ready mobile apps in minutes.',
    (SELECT id FROM categories WHERE slug = 'mobile-apps' LIMIT 1),
    59.99,
    599.99,
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500',
    '["https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500"]',
    false,
    true,
    true,
    4.7,
    312,
    2100,
    '1.8.0',
    '25MB',
    'React Native 0.70+, Flutter 3.0+, or both'
  ),
  (
    'Node.js API Framework',
    'nodejs-api-framework',
    'Lightweight Express-based API framework with best practices',
    'Production-ready Node.js REST API framework with authentication, validation, error handling, and comprehensive testing setup. Built on Express with TypeScript.',
    (SELECT id FROM categories WHERE slug = 'backend-tools' LIMIT 1),
    39.99,
    399.99,
    'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=500',
    '["https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=500"]',
    false,
    false,
    false,
    4.6,
    156,
    742,
    '2.0.0',
    '12MB',
    'Node.js 16+, npm 8+'
  ),
  (
    'Analytics Dashboard Suite',
    'analytics-dashboard-suite',
    'Real-time analytics dashboard with data visualization',
    'Beautiful analytics dashboard with real-time data visualization, custom reports, and advanced filtering. Includes sample data integration and API examples.',
    (SELECT id FROM categories WHERE slug = 'analytics' LIMIT 1),
    69.99,
    699.99,
    'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=500',
    '["https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=500"]',
    true,
    true,
    false,
    4.9,
    428,
    3250,
    '4.2.0',
    '32MB',
    'React 18+, Node.js 14+, PostgreSQL or MongoDB'
  );

-- Insert Product Features for React Dashboard Pro
INSERT INTO product_features (product_id, title, description, icon) VALUES
  (
    (SELECT id FROM products WHERE slug = 'react-dashboard-pro' LIMIT 1),
    'Responsive Design',
    'Works perfectly on desktop, tablet, and mobile devices',
    '📱'
  ),
  (
    (SELECT id FROM products WHERE slug = 'react-dashboard-pro' LIMIT 1),
    'Dark Mode',
    'Built-in dark and light theme toggle',
    '🌙'
  ),
  (
    (SELECT id FROM products WHERE slug = 'react-dashboard-pro' LIMIT 1),
    '50+ Components',
    'Pre-built React components ready to use',
    '🧩'
  ),
  (
    (SELECT id FROM products WHERE slug = 'react-dashboard-pro' LIMIT 1),
    'TypeScript Support',
    'Fully typed with TypeScript for better development experience',
    '📘'
  );

-- Insert Product Features for Vue Component Library
INSERT INTO product_features (product_id, title, description, icon) VALUES
  (
    (SELECT id FROM products WHERE slug = 'vue-ui-component-library' LIMIT 1),
    '100+ Components',
    'Extensive component library for all UI needs',
    '🧩'
  ),
  (
    (SELECT id FROM products WHERE slug = 'vue-ui-component-library' LIMIT 1),
    'Storybook Integration',
    'Complete Storybook setup for component documentation',
    '📖'
  ),
  (
    (SELECT id FROM products WHERE slug = 'vue-ui-component-library' LIMIT 1),
    'Vue 3 Composition API',
    'Modern Vue 3 with Composition API support',
    '⚡'
  );

-- Link Products to Technologies
INSERT INTO product_technologies (product_id, technology_id)
SELECT 
  (SELECT id FROM products WHERE slug = 'react-dashboard-pro' LIMIT 1),
  id
FROM technologies WHERE name IN ('React', 'TypeScript', 'TailwindCSS')
ON CONFLICT DO NOTHING;

INSERT INTO product_technologies (product_id, technology_id)
SELECT 
  (SELECT id FROM products WHERE slug = 'vue-ui-component-library' LIMIT 1),
  id
FROM technologies WHERE name IN ('Vue.js', 'TypeScript')
ON CONFLICT DO NOTHING;

INSERT INTO product_technologies (product_id, technology_id)
SELECT 
  (SELECT id FROM products WHERE slug = 'nodejs-api-framework' LIMIT 1),
  id
FROM technologies WHERE name IN ('Node.js', 'TypeScript', 'PostgreSQL')
ON CONFLICT DO NOTHING;

INSERT INTO product_technologies (product_id, technology_id)
SELECT 
  (SELECT id FROM products WHERE slug = 'analytics-dashboard-suite' LIMIT 1),
  id
FROM technologies WHERE name IN ('React', 'Node.js', 'PostgreSQL', 'GraphQL')
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, title, content, is_verified_purchase) 
VALUES
  (
    (SELECT id FROM products WHERE slug = 'react-dashboard-pro' LIMIT 1),
    NULL,
    5,
    'Excellent Dashboard Template',
    'This dashboard template saved me weeks of development time. Great components, well-documented, and easy to customize.',
    true
  ),
  (
    (SELECT id FROM products WHERE slug = 'react-dashboard-pro' LIMIT 1),
    NULL,
    4,
    'Good but needs more examples',
    'Really good template but would benefit from more real-world examples. Still very usable.',
    true
  ),
  (
    (SELECT id FROM products WHERE slug = 'vue-ui-component-library' LIMIT 1),
    NULL,
    5,
    'Best Vue Component Library',
    'Comprehensive and well-designed. Saves so much time on projects.',
    true
  );
