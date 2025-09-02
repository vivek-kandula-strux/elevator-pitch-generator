-- Create table to track synced record IDs and prevent duplicates
CREATE TABLE IF NOT EXISTS public.sync_record_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type text NOT NULL,
  record_id uuid NOT NULL,
  table_name text NOT NULL,
  record_timestamp timestamp with time zone NOT NULL,
  synced_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(sync_type, record_id)
);

-- Enable RLS
ALTER TABLE public.sync_record_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can manage sync tracking" 
ON public.sync_record_tracking 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add index for performance
CREATE INDEX idx_sync_record_tracking_lookup ON public.sync_record_tracking(sync_type, record_id);
CREATE INDEX idx_sync_record_tracking_timestamp ON public.sync_record_tracking(sync_type, record_timestamp DESC);