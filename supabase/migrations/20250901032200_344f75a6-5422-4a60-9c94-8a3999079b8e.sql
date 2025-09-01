-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for proper role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$$;

-- Update the is_admin function to properly check roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT CASE 
        WHEN auth.uid() IS NULL THEN FALSE
        ELSE public.has_role(auth.uid(), 'admin'::app_role)
    END
$$;

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Create trigger for new user handling
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix Requirements table RLS policies (CRITICAL SECURITY FIX)
DROP POLICY IF EXISTS "Admins can view requirements" ON public.requirements;
DROP POLICY IF EXISTS "Admins can update requirements" ON public.requirements;
DROP POLICY IF EXISTS "Admins can delete requirements" ON public.requirements;

-- Create secure admin-only policies for requirements
CREATE POLICY "Authenticated admins can view requirements"
ON public.requirements
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins can update requirements"
ON public.requirements
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins can delete requirements"
ON public.requirements
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Keep public insert policy for contact forms
-- "Anyone can insert requirements" policy remains unchanged

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger for new tables
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();