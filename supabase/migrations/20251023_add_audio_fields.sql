
-- Check if the audio_url column exists in the stories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'stories' 
    AND column_name = 'audio_url'
  ) THEN
    -- Add audio_url column to stories table
    ALTER TABLE stories ADD COLUMN audio_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'stories' 
    AND column_name = 'has_audio'
  ) THEN
    -- Add has_audio column to stories table
    ALTER TABLE stories ADD COLUMN has_audio BOOLEAN DEFAULT FALSE;
  END IF;
END
$$;

-- Create storage bucket for audio recordings if it doesn't exist
-- Make storage bucket publicly accessible for download links
INSERT INTO storage.buckets (id, name, public)
VALUES ('story_recordings', 'story_recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files (since we're using public bucket)
CREATE POLICY "Public Access to Story Recordings" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'story_recordings');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated Users Can Upload Story Recordings" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'story_recordings' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete only their own files
CREATE POLICY "Users Can Delete Their Own Recordings" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'story_recordings' 
    AND auth.uid() = owner
  );
