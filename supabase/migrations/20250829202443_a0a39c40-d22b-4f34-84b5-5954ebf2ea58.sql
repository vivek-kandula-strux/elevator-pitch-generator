-- Make the Branding bucket public so logo can be accessed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'Branding';

-- Create RLS policy to allow public read access to Branding bucket files
CREATE POLICY "Public read access for Branding bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'Branding');