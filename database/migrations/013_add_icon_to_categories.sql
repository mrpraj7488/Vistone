-- Add icon column to categories table
-- Migration 013: Add icon field for category visual representation

-- Add icon column to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS icon VARCHAR(10) DEFAULT '📁';

-- Update existing categories with appropriate icons based on their names
UPDATE categories 
SET icon = 
  CASE 
    WHEN LOWER(name) LIKE '%software%' OR LOWER(name) LIKE '%app%' THEN '💻'
    WHEN LOWER(name) LIKE '%template%' OR LOWER(name) LIKE '%theme%' THEN '🎨'
    WHEN LOWER(name) LIKE '%plugin%' OR LOWER(name) LIKE '%extension%' THEN '🔌'
    WHEN LOWER(name) LIKE '%graphic%' OR LOWER(name) LIKE '%design%' THEN '🎭'
    WHEN LOWER(name) LIKE '%audio%' OR LOWER(name) LIKE '%music%' THEN '🎵'
    WHEN LOWER(name) LIKE '%video%' OR LOWER(name) LIKE '%media%' THEN '🎬'
    WHEN LOWER(name) LIKE '%font%' OR LOWER(name) LIKE '%typography%' THEN '🔤'
    WHEN LOWER(name) LIKE '%icon%' OR LOWER(name) LIKE '%symbol%' THEN '🎯'
    WHEN LOWER(name) LIKE '%business%' OR LOWER(name) LIKE '%corporate%' THEN '💼'
    WHEN LOWER(name) LIKE '%education%' OR LOWER(name) LIKE '%learning%' THEN '📚'
    WHEN LOWER(name) LIKE '%ecommerce%' OR LOWER(name) LIKE '%shop%' THEN '🛍️'
    WHEN LOWER(name) LIKE '%blog%' OR LOWER(name) LIKE '%content%' THEN '📝'
    WHEN LOWER(name) LIKE '%gaming%' OR LOWER(name) LIKE '%game%' THEN '🎮'
    WHEN LOWER(name) LIKE '%healthcare%' OR LOWER(name) LIKE '%medical%' THEN '🏥'
    WHEN LOWER(name) LIKE '%food%' OR LOWER(name) LIKE '%restaurant%' THEN '🍔'
    WHEN LOWER(name) LIKE '%marketing%' OR LOWER(name) LIKE '%promotion%' THEN '📈'
    WHEN LOWER(name) LIKE '%tool%' OR LOWER(name) LIKE '%utility%' THEN '🔧'
    WHEN LOWER(name) LIKE '%mobile%' OR LOWER(name) LIKE '%phone%' THEN '📱'
    WHEN LOWER(name) LIKE '%dashboard%' OR LOWER(name) LIKE '%admin%' THEN '📊'
    ELSE '📁'
  END
WHERE icon = '📁' OR icon IS NULL;

-- Add index for icon-based queries (optional)
CREATE INDEX IF NOT EXISTS idx_categories_icon ON categories(icon);

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'categories' AND column_name = 'icon';

-- Show updated categories with icons
SELECT id, name, icon, color, display_order 
FROM categories 
ORDER BY display_order;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Icon column added successfully to categories table';
    RAISE NOTICE '🎨 Categories updated with appropriate icons';
END $$;
