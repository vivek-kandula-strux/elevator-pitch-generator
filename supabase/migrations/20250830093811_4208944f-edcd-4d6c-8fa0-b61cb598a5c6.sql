-- Add RLS policies for requirements table to allow authorized access
-- while maintaining security for customer contact information

-- Create a function to check if user is an admin
-- This will be used once authentication is implemented
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, return false since no authentication is implemented
  -- This will need to be updated when user roles are added
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add SELECT policy for admin users only
-- This policy will deny all access for now (secure by default)
-- and can be updated when authentication is implemented
CREATE POLICY "Admins can view requirements" 
ON public.requirements 
FOR SELECT 
USING (public.is_admin());

-- Add UPDATE policy for admin users only
CREATE POLICY "Admins can update requirements" 
ON public.requirements 
FOR UPDATE 
USING (public.is_admin());

-- Add DELETE policy for admin users only  
CREATE POLICY "Admins can delete requirements" 
ON public.requirements 
FOR DELETE 
USING (public.is_admin());

-- Add comments to document the security model
COMMENT ON TABLE public.requirements IS 'Customer requirements with sensitive contact information. Access restricted to admin users only via RLS policies.';
COMMENT ON FUNCTION public.is_admin() IS 'Security function to check admin privileges. Returns FALSE until authentication is implemented.';