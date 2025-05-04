
-- Create a bucket for story recordings if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'story-recordings', 'story-recordings', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'story-recordings'
);

-- Add policies to allow authenticated users to upload to this bucket
BEGIN;
  -- Insert policy for authenticated users to upload
  INSERT INTO storage.policies (name, definition, bucket_id)
  SELECT 
    'Allow authenticated uploads for recordings', 
    '(auth.role() = ''authenticated'')',
    'story-recordings'
  WHERE NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'story-recordings' 
    AND name = 'Allow authenticated uploads for recordings'
  );

  -- Insert policy for public read access
  INSERT INTO storage.policies (name, definition, bucket_id)
  SELECT 
    'Public read access for recordings', 
    'true',
    'story-recordings'
  WHERE NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'story-recordings' 
    AND name = 'Public read access for recordings'
  );
COMMIT;
