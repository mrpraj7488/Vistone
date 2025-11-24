-- Blog Posts Table Migration
-- Migration 006: Create blog_posts table for blog functionality
-- Run this in your Supabase SQL Editor

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    category TEXT DEFAULT 'Uncategorized',
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Settings
    allow_comments BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- Create blog_categories table for better category management
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Tutorial', 'tutorial', 'Step-by-step guides and tutorials', '#10B981'),
('Design', 'design', 'Design tips, trends, and inspiration', '#8B5CF6'),
('Development', 'development', 'Programming and development articles', '#3B82F6'),
('News', 'news', 'Latest news and updates', '#F59E0B'),
('Tips', 'tips', 'Quick tips and tricks', '#EF4444')
ON CONFLICT (slug) DO NOTHING;

-- Create blog_comments table for future use
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    author_website TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for comments
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent ON blog_comments(parent_id);

-- Disable RLS for admin operations
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments DISABLE ROW LEVEL SECURITY;

-- Insert sample blog post for testing
INSERT INTO blog_posts (
    title, 
    slug, 
    excerpt, 
    content, 
    category, 
    tags, 
    status, 
    featured_image,
    meta_title,
    meta_description,
    featured
) VALUES (
    'Welcome to Vistone Blog',
    'welcome-to-vistone-blog',
    'Welcome to the official Vistone blog where we share tutorials, tips, and insights about digital products and development.',
    '<h2>Welcome to Vistone</h2><p>This is your first blog post. You can edit or delete it from the admin panel.</p><p>Start creating amazing content for your audience!</p>',
    'News',
    ARRAY['welcome', 'introduction', 'vistone'],
    'published',
    '/images/blog/welcome-post.jpg',
    'Welcome to Vistone Blog - Digital Marketplace',
    'Get started with Vistone blog and learn about digital products, development tips, and marketplace insights.',
    true
) ON CONFLICT (slug) DO NOTHING;

-- Verify table creation
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('blog_posts', 'blog_categories', 'blog_comments')
ORDER BY tablename;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Blog tables created successfully!';
    RAISE NOTICE '📝 Tables: blog_posts, blog_categories, blog_comments';
    RAISE NOTICE '🎯 Sample post added for testing';
    RAISE NOTICE '🚀 Blog functionality ready!';
END $$;
