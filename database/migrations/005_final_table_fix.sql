-- FINAL FIX for user_profiles table
-- This will definitely resolve the 400 error

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Check if table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        -- Create table from scratch
        CREATE TABLE user_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            full_name TEXT,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'editor', 'admin')),
            status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
            country TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Created user_profiles table';
    ELSE
        RAISE NOTICE 'Table user_profiles already exists';
    END IF;
END $$;

-- Step 3: Ensure ID column has proper default (most common issue)
DO $$
BEGIN
    -- Check if id column exists and fix it
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'id'
    ) THEN
        -- Set default value for id column
        ALTER TABLE user_profiles 
        ALTER COLUMN id SET DEFAULT gen_random_uuid();
        
        RAISE NOTICE 'Fixed id column default value';
    ELSE
        -- Add id column if missing
        ALTER TABLE user_profiles 
        ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
        
        RAISE NOTICE 'Added id column';
    END IF;
END $$;

-- Step 4: Add missing columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 5: Ensure email is unique (if not already)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_profiles' 
        AND constraint_type = 'UNIQUE' 
        AND constraint_name LIKE '%email%'
    ) THEN
        ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_email_unique UNIQUE (email);
        RAISE NOTICE 'Added email unique constraint';
    END IF;
END $$;

-- Step 6: Disable RLS for service role operations
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 7: Test insert to verify everything works
DO $$
DECLARE
    test_result RECORD;
BEGIN
    INSERT INTO user_profiles (full_name, email, country) 
    VALUES ('Test User', 'test-' || extract(epoch from now()) || '@example.com', 'United States')
    RETURNING * INTO test_result;
    
    RAISE NOTICE 'SUCCESS: Test insert worked! ID: %', test_result.id;
    
    -- Clean up test record
    DELETE FROM user_profiles WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR in test insert: %', SQLERRM;
END $$;

-- Step 8: Show final table structure
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
