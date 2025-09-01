-- Fix function search path mutable warnings by setting search_path explicitly
DROP FUNCTION IF EXISTS public.cleanup_performance_data();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Create functions with proper search_path settings
CREATE OR REPLACE FUNCTION public.cleanup_performance_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Recreate the update function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;