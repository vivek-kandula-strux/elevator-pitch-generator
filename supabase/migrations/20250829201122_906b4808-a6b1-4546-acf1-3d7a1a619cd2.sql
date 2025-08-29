-- Drop the current policy that still allows all access
DROP POLICY "Access with valid token only" ON public.elevator_pitches;

-- Create a restrictive policy that denies all SELECT by default
-- The application will handle token validation at the query level
CREATE POLICY "Deny all direct access" 
ON public.elevator_pitches 
FOR SELECT 
USING (false);

-- Note: Access is now controlled entirely through application logic
-- Users must provide both recordId and accessToken to fetch data