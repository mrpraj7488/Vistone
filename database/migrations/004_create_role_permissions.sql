-- Create role_permissions table for storing role-based permissions
-- Run this in your Supabase SQL Editor

-- Create the role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('admin', 'co-admin', 'user')),
    permission TEXT NOT NULL,
    granted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, permission)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission);
CREATE INDEX IF NOT EXISTS idx_role_permissions_granted ON role_permissions(granted);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_role_permissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON role_permissions;
CREATE TRIGGER update_role_permissions_updated_at 
    BEFORE UPDATE ON role_permissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_role_permissions_updated_at();

-- Insert default permissions for Admin role
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

-- Insert default permissions for Co-Admin role
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

-- Insert default permissions for User role (all false)
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

-- Disable RLS for admin operations
ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;

-- Verify the table was created and populated
SELECT 
    role, 
    COUNT(*) as total_permissions,
    COUNT(CASE WHEN granted = true THEN 1 END) as granted_permissions
FROM role_permissions 
GROUP BY role 
ORDER BY role;
