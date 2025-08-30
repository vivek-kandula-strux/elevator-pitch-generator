-- Fix security warning: Function Search Path Mutable
-- Update the is_admin function to have a secure search_path

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- For now, return false since no authentication is implemented
  -- This will need to be updated when user roles are added
  RETURN FALSE;
END;
$$;