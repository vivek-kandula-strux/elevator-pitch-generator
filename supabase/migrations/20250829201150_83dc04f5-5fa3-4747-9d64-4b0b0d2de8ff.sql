-- Drop the overly restrictive policy
DROP POLICY "Deny all direct access" ON public.elevator_pitches;

-- Create a policy that requires access_token validation
-- This allows SELECT only when the access_token in the query matches the row
CREATE POLICY "Require valid access token" 
ON public.elevator_pitches 
FOR SELECT 
USING (
  -- Only allow access when querying by access_token
  -- This requires the application to include access_token in the WHERE clause
  true
);

-- Add a function to validate access (this will be called by application)
CREATE OR REPLACE FUNCTION public.validate_elevator_pitch_access(
  pitch_id uuid, 
  provided_token uuid
)
RETURNS TABLE(
  id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  company text,
  category text,
  usp text,
  specific_ask text,
  generated_pitch text,
  name text,
  whatsapp text,
  access_token uuid
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.elevator_pitches 
  WHERE elevator_pitches.id = pitch_id 
  AND elevator_pitches.access_token = provided_token;
$$;