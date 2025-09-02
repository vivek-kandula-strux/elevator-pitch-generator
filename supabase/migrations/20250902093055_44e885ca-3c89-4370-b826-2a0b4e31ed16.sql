-- Fix database function security by adding explicit search_path
-- This prevents potential search_path manipulation attacks

-- Update handle_new_user function with explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Insert into profiles
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id, 
        new.email,
        COALESCE(new.raw_user_meta_data ->> 'full_name', new.email)
    );
    
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
    
    RETURN new;
END;
$function$;

-- Update get_elevator_pitch_by_token function with explicit search_path
CREATE OR REPLACE FUNCTION public.get_elevator_pitch_by_token(pitch_id uuid, provided_token uuid)
 RETURNS json
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT row_to_json(ep) 
  FROM (
    SELECT id, created_at, updated_at, company, category, usp, 
           specific_ask, generated_pitch, name, whatsapp
    FROM public.elevator_pitches 
    WHERE id = pitch_id 
    AND access_token = provided_token
    LIMIT 1
  ) ep;
$function$;