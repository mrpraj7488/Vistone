-- Safe support tickets table creation (handles existing policies)
-- Run this in your Supabase SQL Editor

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'resolved')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);

-- Enable Row Level Security
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DO $$ 
BEGIN
    -- Drop existing policies for support_tickets
    DROP POLICY IF EXISTS "Users can view their own tickets" ON support_tickets;
    DROP POLICY IF EXISTS "Users can create their own tickets" ON support_tickets;
    DROP POLICY IF EXISTS "Users can update their own tickets" ON support_tickets;
    DROP POLICY IF EXISTS "Service role can access all tickets" ON support_tickets;
    
    -- Create new policies for support_tickets
    CREATE POLICY "Users can view their own tickets" ON support_tickets
        FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can create their own tickets" ON support_tickets
        FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own tickets" ON support_tickets
        FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Service role can access all tickets" ON support_tickets
        FOR ALL USING (auth.role() = 'service_role');
        
    RAISE NOTICE '✅ Support tickets table and policies created successfully';
END $$;

-- Insert some sample tickets for testing (optional - only if user is authenticated)
DO $$
BEGIN
    IF auth.uid() IS NOT NULL THEN
        INSERT INTO support_tickets (user_id, subject, description, status, priority, category) 
        VALUES 
            (auth.uid(), 'Welcome to Support', 'This is a sample support ticket to test the system', 'open', 'low', 'general'),
            (auth.uid(), 'Feature Request', 'Sample feature request ticket', 'open', 'medium', 'feature')
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE '✅ Sample tickets created';
    ELSE
        RAISE NOTICE 'ℹ️ No authenticated user - skipping sample tickets';
    END IF;
END $$;
