-- Add sample support tickets for testing
-- Run this after creating the support_tickets table

-- First, let's check if we have any authenticated users
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Try to get a user ID from auth.users
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Insert sample tickets with the found user ID
        INSERT INTO support_tickets (user_id, subject, description, status, priority, category) 
        VALUES 
            (sample_user_id, 'Welcome to Support System', 'This is a sample support ticket to demonstrate the system functionality. You can edit, update, and manage tickets from the admin panel.', 'open', 'low', 'general'),
            (sample_user_id, 'Feature Request: Dark Mode', 'It would be great to have a dark mode option for the dashboard. This would improve user experience during night time usage.', 'in_progress', 'medium', 'feature'),
            (sample_user_id, 'Bug Report: Login Issue', 'Sometimes the login form does not respond when clicking the submit button. This happens intermittently.', 'open', 'high', 'bug'),
            (sample_user_id, 'Account Question', 'I need help understanding how to update my profile information and change my password.', 'closed', 'low', 'account')
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE '✅ Sample tickets created for user: %', sample_user_id;
    ELSE
        -- Create tickets with a placeholder user ID (you can update this later)
        INSERT INTO support_tickets (user_id, subject, description, status, priority, category) 
        VALUES 
            (gen_random_uuid(), 'Welcome to Support System', 'This is a sample support ticket to demonstrate the system functionality.', 'open', 'low', 'general'),
            (gen_random_uuid(), 'Feature Request: Dark Mode', 'It would be great to have a dark mode option for the dashboard.', 'in_progress', 'medium', 'feature'),
            (gen_random_uuid(), 'Bug Report: Login Issue', 'Sometimes the login form does not respond when clicking submit.', 'open', 'high', 'bug')
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE '✅ Sample tickets created with placeholder user IDs';
    END IF;
END $$;

-- Show the created tickets
SELECT 
    id,
    subject,
    status,
    priority,
    category,
    created_at
FROM support_tickets 
ORDER BY created_at DESC;
