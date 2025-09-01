-- Create sync_metadata table to track sync operations
CREATE TABLE public.sync_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('elevator_pitches', 'requirements')),
  last_sync_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_sync_row_count INTEGER NOT NULL DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'success' CHECK (sync_status IN ('success', 'partial', 'failed')),
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sync_type)
);

-- Enable RLS
ALTER TABLE public.sync_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Service role can manage sync metadata" 
ON public.sync_metadata 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create index for faster lookups
CREATE INDEX idx_sync_metadata_type_timestamp ON public.sync_metadata(sync_type, last_sync_timestamp);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sync_metadata_updated_at
BEFORE UPDATE ON public.sync_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();