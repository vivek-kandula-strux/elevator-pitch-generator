-- Fix remaining function security issues by adding explicit search_path
-- This prevents potential search_path manipulation attacks

-- Update cleanup_performance_data function
CREATE OR REPLACE FUNCTION public.cleanup_performance_data()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Clean up completed jobs older than 7 days
  DELETE FROM public.job_queue 
  WHERE status IN ('completed', 'failed') 
  AND completed_at < now() - interval '7 days';
  
  -- Clean up old rate limit records older than 1 day
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - interval '1 day';
  
  -- Clean up old performance metrics older than 30 days
  DELETE FROM public.performance_metrics 
  WHERE timestamp < now() - interval '30 days';
END;
$function$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
    SELECT CASE 
        WHEN auth.uid() IS NULL THEN FALSE
        ELSE public.has_role(auth.uid(), 'admin'::app_role)
    END
$function$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$function$;