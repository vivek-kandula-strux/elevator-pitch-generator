-- Drop all triggers first, then recreate the function
DROP TRIGGER IF EXISTS update_elevator_pitches_updated_at ON public.elevator_pitches;
DROP TRIGGER IF EXISTS update_requirements_updated_at ON public.requirements;
DROP TRIGGER IF EXISTS update_job_queue_updated_at ON public.job_queue;
DROP TRIGGER IF EXISTS update_rate_limits_updated_at ON public.rate_limits;
DROP TRIGGER IF EXISTS update_circuit_breaker_updated_at ON public.circuit_breaker_state;

-- Now drop and recreate the function with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.cleanup_performance_data();

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

-- Recreate all the triggers
CREATE TRIGGER update_elevator_pitches_updated_at
  BEFORE UPDATE ON public.elevator_pitches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requirements_updated_at
  BEFORE UPDATE ON public.requirements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_queue_updated_at
  BEFORE UPDATE ON public.job_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_circuit_breaker_updated_at
  BEFORE UPDATE ON public.circuit_breaker_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();