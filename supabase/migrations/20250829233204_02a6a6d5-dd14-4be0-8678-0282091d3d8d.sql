-- Create requirements table for service requirement submissions
CREATE TABLE public.requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for requirements form
CREATE POLICY "Anyone can insert requirements" 
ON public.requirements 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_requirements_updated_at
BEFORE UPDATE ON public.requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();