-- Make Client Logos bucket public for direct image access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'Client Logos';