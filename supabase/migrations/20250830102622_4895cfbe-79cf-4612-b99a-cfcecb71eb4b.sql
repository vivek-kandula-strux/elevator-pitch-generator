-- Performance optimization indexes for elevator_pitches table
CREATE INDEX IF NOT EXISTS idx_elevator_pitches_created_at ON elevator_pitches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_elevator_pitches_company_created ON elevator_pitches(company, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_elevator_pitches_category_created ON elevator_pitches(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_elevator_pitches_access_token ON elevator_pitches(access_token);

-- Performance optimization indexes for requirements table  
CREATE INDEX IF NOT EXISTS idx_requirements_created_at ON requirements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requirements_service_type_created ON requirements(service_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requirements_email ON requirements(email);

-- Add composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_elevator_pitches_company_category ON elevator_pitches(company, category);