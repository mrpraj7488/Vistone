-- Add display_order column to categories table
-- Migration 008: Add display_order field for category ordering

-- Add display_order column to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing categories with display_order values
UPDATE categories 
SET display_order = 
  CASE name
    WHEN 'Software' THEN 1
    WHEN 'Templates' THEN 2
    WHEN 'Themes' THEN 3
    WHEN 'Plugins' THEN 4
    WHEN 'Graphics' THEN 5
    WHEN 'Audio' THEN 6
    WHEN 'Video' THEN 7
    WHEN 'Fonts' THEN 8
    WHEN 'Icons' THEN 9
    WHEN 'Other' THEN 10
    ELSE (SELECT COALESCE(MAX(display_order), 0) + 1 FROM categories c2 WHERE c2.id != categories.id)
  END
WHERE display_order = 0 OR display_order IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'categories' AND column_name = 'display_order';

-- Show updated categories with display_order
SELECT id, name, display_order 
FROM categories 
ORDER BY display_order;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Display order column added successfully to categories table';
    RAISE NOTICE '📊 Categories ordered by display_order';
END $$;
