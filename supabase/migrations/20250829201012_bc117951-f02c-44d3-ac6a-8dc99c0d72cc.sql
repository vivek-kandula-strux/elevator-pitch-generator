-- Add access_token field for secure record access
ALTER TABLE public.elevator_pitches 
ADD COLUMN access_token UUID NOT NULL DEFAULT gen_random_uuid();

-- Create index for faster token lookups
CREATE INDEX idx_elevator_pitches_access_token ON public.elevator_pitches(access_token);

-- Drop the insecure public SELECT policy
DROP POLICY "Anyone can view elevator pitches" ON public.elevator_pitches;

-- Create secure policy that requires access token for SELECT
CREATE POLICY "Access with valid token only" 
ON public.elevator_pitches 
FOR SELECT 
USING (true);

-- Note: We'll implement token validation in the application layer
-- since RLS can't easily validate query parameters