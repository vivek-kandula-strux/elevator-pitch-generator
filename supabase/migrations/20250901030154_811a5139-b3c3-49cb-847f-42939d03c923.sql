-- Create job queue table for async processing
CREATE TABLE public.job_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type TEXT NOT NULL, -- 'generate_pitch', 'sync_sheets', 'send_notification'
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed, retrying
  priority INTEGER NOT NULL DEFAULT 5, -- 1 (highest) to 10 (lowest)
  max_retries INTEGER NOT NULL DEFAULT 3,
  retry_count INTEGER NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rate limiting table
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL, -- 'openai_global', 'sheets_global', 'user:{user_id}', 'ip:{ip_address}'
  request_count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  window_duration_minutes INTEGER NOT NULL DEFAULT 1,
  max_requests INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(key, window_start)
);

-- Create circuit breaker state table
CREATE TABLE public.circuit_breaker_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL UNIQUE, -- 'openai', 'google_sheets'
  state TEXT NOT NULL DEFAULT 'closed', -- closed, open, half_open
  failure_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  last_failure_at TIMESTAMP WITH TIME ZONE,
  last_success_at TIMESTAMP WITH TIME ZONE,
  failure_threshold INTEGER NOT NULL DEFAULT 5,
  recovery_timeout_minutes INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance monitoring table
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'api_latency', 'queue_size', 'error_rate'
  service_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX idx_job_queue_status_priority ON public.job_queue(status, priority, scheduled_at);
CREATE INDEX idx_job_queue_type_status ON public.job_queue(job_type, status);
CREATE INDEX idx_rate_limits_key_window ON public.rate_limits(key, window_start);
CREATE INDEX idx_performance_metrics_timestamp ON public.performance_metrics(timestamp DESC);
CREATE INDEX idx_performance_metrics_service ON public.performance_metrics(service_name, timestamp DESC);

-- Enable RLS
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_breaker_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (these tables are backend-only)
CREATE POLICY "Service role can manage job queue" ON public.job_queue
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage rate limits" ON public.rate_limits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage circuit breaker" ON public.circuit_breaker_state
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage performance metrics" ON public.performance_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to clean up old data
CREATE OR REPLACE FUNCTION public.cleanup_performance_data()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_job_queue_updated_at
  BEFORE UPDATE ON public.job_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_circuit_breaker_updated_at
  BEFORE UPDATE ON public.circuit_breaker_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Initialize circuit breaker states
INSERT INTO public.circuit_breaker_state (service_name, failure_threshold, recovery_timeout_minutes)
VALUES 
  ('openai', 5, 5),
  ('google_sheets', 3, 10)
ON CONFLICT (service_name) DO NOTHING;