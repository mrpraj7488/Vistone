-- 🚀 VISTONE COMPLETE DATABASE SETUP
-- This script sets up the entire database for the Vistone SaaS platform
-- Run this in your Supabase SQL Editor for a fresh installation

-- ============================================
-- STEP 1: EXTENSIONS AND BASIC SETUP
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- STEP 2: USER PROFILES TABLE
-- ============================================

-- Create user_profiles table with optimized structure
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'co-admin', 'user')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    country TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- ============================================
-- STEP 3: ROLE PERMISSIONS SYSTEM
-- ============================================

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('admin', 'co-admin', 'user')),
    permission TEXT NOT NULL,
    granted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, permission)
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission);
CREATE INDEX IF NOT EXISTS idx_role_permissions_granted ON role_permissions(granted);

-- ============================================
-- STEP 4: PRODUCTS AND ORDERS (FUTURE)
-- ============================================

-- Products table for digital marketplace
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    category TEXT,
    tags TEXT[],
    images TEXT[],
    download_url TEXT,
    license_type TEXT DEFAULT 'single',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table for purchase tracking
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    product_id UUID REFERENCES products(id),
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    payment_id TEXT,
    license_key TEXT,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 5: TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON role_permissions;
CREATE TRIGGER update_role_permissions_updated_at 
    BEFORE UPDATE ON role_permissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 6: DEFAULT PERMISSIONS DATA
-- ============================================

-- Insert comprehensive permissions for Admin (full access)
INSERT INTO role_permissions (role, permission, granted) VALUES
-- Dashboard & Analytics
('admin', 'view_dashboard', true),
('admin', 'view_analytics', true),
('admin', 'export_reports', true),
-- User Management
('admin', 'view_users', true),
('admin', 'create_users', true),
('admin', 'edit_users', true),
('admin', 'delete_users', true),
('admin', 'manage_user_roles', true),
-- Product Management
('admin', 'view_products', true),
('admin', 'create_products', true),
('admin', 'edit_products', true),
('admin', 'delete_products', true),
('admin', 'manage_categories', true),
('admin', 'manage_inventory', true),
-- Order Management
('admin', 'view_orders', true),
('admin', 'edit_orders', true),
('admin', 'process_orders', true),
('admin', 'cancel_orders', true),
('admin', 'process_refunds', true),
-- Content Management
('admin', 'view_content', true),
('admin', 'create_content', true),
('admin', 'edit_content', true),
('admin', 'delete_content', true),
('admin', 'manage_media', true),
-- System Settings
('admin', 'view_settings', true),
('admin', 'edit_settings', true),
('admin', 'manage_integrations', true),
('admin', 'view_logs', true),
('admin', 'system_maintenance', true)
ON CONFLICT (role, permission) DO UPDATE SET granted = EXCLUDED.granted;

-- Insert permissions for Co-Admin (limited access)
INSERT INTO role_permissions (role, permission, granted) VALUES
-- Dashboard & Analytics
('co-admin', 'view_dashboard', true),
('co-admin', 'view_analytics', true),
('co-admin', 'export_reports', false),
-- User Management
('co-admin', 'view_users', true),
('co-admin', 'create_users', false),
('co-admin', 'edit_users', false),
('co-admin', 'delete_users', false),
('co-admin', 'manage_user_roles', false),
-- Product Management
('co-admin', 'view_products', true),
('co-admin', 'create_products', true),
('co-admin', 'edit_products', true),
('co-admin', 'delete_products', false),
('co-admin', 'manage_categories', true),
('co-admin', 'manage_inventory', true),
-- Order Management
('co-admin', 'view_orders', true),
('co-admin', 'edit_orders', true),
('co-admin', 'process_orders', true),
('co-admin', 'cancel_orders', false),
('co-admin', 'process_refunds', false),
-- Content Management
('co-admin', 'view_content', true),
('co-admin', 'create_content', true),
('co-admin', 'edit_content', true),
('co-admin', 'delete_content', false),
('co-admin', 'manage_media', true),
-- System Settings
('co-admin', 'view_settings', true),
('co-admin', 'edit_settings', false),
('co-admin', 'manage_integrations', false),
('co-admin', 'view_logs', false),
('co-admin', 'system_maintenance', false)
ON CONFLICT (role, permission) DO UPDATE SET granted = EXCLUDED.granted;

-- Insert permissions for User (minimal access)
INSERT INTO role_permissions (role, permission, granted) VALUES
-- Dashboard & Analytics
('user', 'view_dashboard', false),
('user', 'view_analytics', false),
('user', 'export_reports', false),
-- User Management
('user', 'view_users', false),
('user', 'create_users', false),
('user', 'edit_users', false),
('user', 'delete_users', false),
('user', 'manage_user_roles', false),
-- Product Management
('user', 'view_products', false),
('user', 'create_products', false),
('user', 'edit_products', false),
('user', 'delete_products', false),
('user', 'manage_categories', false),
('user', 'manage_inventory', false),
-- Order Management
('user', 'view_orders', false),
('user', 'edit_orders', false),
('user', 'process_orders', false),
('user', 'cancel_orders', false),
('user', 'process_refunds', false),
-- Content Management
('user', 'view_content', false),
('user', 'create_content', false),
('user', 'edit_content', false),
('user', 'delete_content', false),
('user', 'manage_media', false),
-- System Settings
('user', 'view_settings', false),
('user', 'edit_settings', false),
('user', 'manage_integrations', false),
('user', 'view_logs', false),
('user', 'system_maintenance', false)
ON CONFLICT (role, permission) DO UPDATE SET granted = EXCLUDED.granted;

-- ============================================
-- STEP 7: SECURITY SETTINGS
-- ============================================

-- Disable RLS for service role operations (admin access)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 8: VERIFICATION
-- ============================================

-- Verify table creation
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('user_profiles', 'role_permissions', 'products', 'orders')
ORDER BY tablename;

-- Verify permissions setup
SELECT 
    role, 
    COUNT(*) as total_permissions,
    COUNT(CASE WHEN granted = true THEN 1 END) as granted_permissions
FROM role_permissions 
GROUP BY role 
ORDER BY role;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Vistone database setup completed successfully!';
    RAISE NOTICE '📊 Tables created: user_profiles, role_permissions, products, orders';
    RAISE NOTICE '🔐 Permissions configured for 3-role system';
    RAISE NOTICE '🚀 Ready for production deployment!';
END $$;
