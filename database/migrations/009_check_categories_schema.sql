-- Check current categories table schema
-- This will help us understand what columns exist

-- Check if categories table exists and show its structure
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'categories'
ORDER BY ordinal_position;

-- Show sample data from categories table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN
        RAISE NOTICE '📋 Categories table exists. Sample data:';
        -- This will show the first few categories
        PERFORM * FROM categories LIMIT 3;
    ELSE
        RAISE NOTICE '❌ Categories table does not exist!';
    END IF;
END $$;
