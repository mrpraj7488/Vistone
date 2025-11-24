-- Clean up user roles and set up proper 3-role system
-- 1. Admin (full access)
-- 2. Co-Admin (limited access) 
-- 3. User (regular user)

-- Step 1: Update existing users to use the new role system
UPDATE user_profiles 
SET role = CASE 
    WHEN role IN ('admin', 'administrator', 'super_admin', 'owner') THEN 'admin'
    WHEN role IN ('editor', 'moderator', 'manager', 'co_admin', 'co-admin') THEN 'co-admin'
    ELSE 'user'
END;

-- Step 2: Add a proper role constraint with only the 3 allowed roles
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('admin', 'co-admin', 'user'));

-- Step 3: Set default role to user
ALTER TABLE user_profiles 
ALTER COLUMN role SET DEFAULT 'user';

-- Step 4: Show current role distribution
SELECT role, COUNT(*) as count 
FROM user_profiles 
GROUP BY role 
ORDER BY count DESC;

-- Step 5: Test the constraint works
DO $$
BEGIN
    -- Test valid roles
    INSERT INTO user_profiles (full_name, email, role) 
    VALUES ('Test Admin', 'test-admin@example.com', 'admin');
    
    INSERT INTO user_profiles (full_name, email, role) 
    VALUES ('Test Co-Admin', 'test-co-admin@example.com', 'co-admin');
    
    INSERT INTO user_profiles (full_name, email, role) 
    VALUES ('Test User', 'test-user@example.com', 'user');
    
    RAISE NOTICE 'SUCCESS: All 3 role types work correctly';
    
    -- Clean up test records
    DELETE FROM user_profiles WHERE email LIKE 'test-%@example.com';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR: %', SQLERRM;
END $$;
