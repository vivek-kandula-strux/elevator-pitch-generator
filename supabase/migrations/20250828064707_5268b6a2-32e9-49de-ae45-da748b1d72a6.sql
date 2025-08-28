-- Create table for storing form submissions and elevator pitches
CREATE TABLE public.elevator_pitches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  usp TEXT NOT NULL,
  specific_ask TEXT NOT NULL,
  generated_pitch TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.elevator_pitches ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since this is a form anyone can submit)
CREATE POLICY "Anyone can insert elevator pitches" 
ON public.elevator_pitches 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view elevator pitches" 
ON public.elevator_pitches 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_elevator_pitches_updated_at
BEFORE UPDATE ON public.elevator_pitches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();