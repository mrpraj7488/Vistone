-- Add read_time column to blog_posts table
-- Migration 007: Add read_time field for better user experience

-- Add read_time column
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS read_time INTEGER DEFAULT 5;

-- Update existing posts with estimated read time based on content length
UPDATE blog_posts 
SET read_time = GREATEST(1, LEAST(20, LENGTH(COALESCE(content, '')) / 200))
WHERE read_time IS NULL OR read_time = 5;

-- Create function to automatically calculate read time
CREATE OR REPLACE FUNCTION calculate_read_time(content_text TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- Estimate read time based on average reading speed of 200 words per minute
    -- Minimum 1 minute, maximum 20 minutes
    RETURN GREATEST(1, LEAST(20, LENGTH(COALESCE(content_text, '')) / 200));
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update read_time when content changes
CREATE OR REPLACE FUNCTION update_read_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.read_time = calculate_read_time(NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_read_time ON blog_posts;
CREATE TRIGGER trigger_update_read_time
    BEFORE INSERT OR UPDATE OF content ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_read_time();

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name = 'read_time';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Read time column added successfully to blog_posts table';
    RAISE NOTICE '🔄 Automatic read time calculation enabled';
END $$;
