-- Add color column to categories table
-- Migration 010: Add color field for category theming

-- Add color column to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#3B82F6';

-- Update existing categories with default colors based on their names
UPDATE categories 
SET color = 
  CASE 
    WHEN LOWER(name) LIKE '%software%' OR LOWER(name) LIKE '%app%' THEN '#3B82F6'
    WHEN LOWER(name) LIKE '%template%' OR LOWER(name) LIKE '%theme%' THEN '#8B5CF6'
    WHEN LOWER(name) LIKE '%plugin%' OR LOWER(name) LIKE '%extension%' THEN '#10B981'
    WHEN LOWER(name) LIKE '%graphic%' OR LOWER(name) LIKE '%design%' THEN '#F59E0B'
    WHEN LOWER(name) LIKE '%audio%' OR LOWER(name) LIKE '%music%' THEN '#EF4444'
    WHEN LOWER(name) LIKE '%video%' OR LOWER(name) LIKE '%media%' THEN '#EC4899'
    WHEN LOWER(name) LIKE '%font%' OR LOWER(name) LIKE '%typography%' THEN '#6366F1'
    WHEN LOWER(name) LIKE '%icon%' OR LOWER(name) LIKE '%symbol%' THEN '#14B8A6'
    WHEN LOWER(name) LIKE '%business%' OR LOWER(name) LIKE '%corporate%' THEN '#0EA5E9'
    WHEN LOWER(name) LIKE '%education%' OR LOWER(name) LIKE '%learning%' THEN '#84CC16'
    ELSE '#6B7280'
  END
WHERE color = '#3B82F6' OR color IS NULL;

-- Add index for color-based queries (optional)
CREATE INDEX IF NOT EXISTS idx_categories_color ON categories(color);

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'categories' AND column_name = 'color';

-- Show updated categories with colors
SELECT id, name, color, display_order 
FROM categories 
ORDER BY display_order;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Color column added successfully to categories table';
    RAISE NOTICE '🎨 Categories updated with theme colors';
END $$;
