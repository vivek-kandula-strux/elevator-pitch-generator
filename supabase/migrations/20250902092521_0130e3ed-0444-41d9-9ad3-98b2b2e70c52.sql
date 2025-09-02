-- Add explicit policy to deny public access to requirements table
-- This prevents any potential data exposure if the admin role check fails

CREATE POLICY "Deny public access to requirements" 
ON public.requirements 
FOR SELECT 
TO public 
USING (false);

-- Also add a more restrictive policy for the profiles table to address the other security finding
CREATE POLICY "Deny public access to profiles" 
ON public.profiles 
FOR SELECT 
TO public 
USING (false);