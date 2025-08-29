-- Create a simple function to securely fetch elevator pitch data  
CREATE OR REPLACE FUNCTION public.get_elevator_pitch_by_token(
  pitch_id uuid, 
  provided_token uuid
)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT row_to_json(ep) 
  FROM (
    SELECT id, created_at, updated_at, company, category, usp, 
           specific_ask, generated_pitch, name, whatsapp
    FROM public.elevator_pitches 
    WHERE id = pitch_id 
    AND access_token = provided_token
    LIMIT 1
  ) ep;
$$;

-- Create RLS policy to deny all direct table access
CREATE POLICY "No direct table access" 
ON public.elevator_pitches 
FOR SELECT 
USING (false);