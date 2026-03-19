-- BUG RESPALDO (Desde Bugs Editor)
ALTER TABLE events ADD COLUMN IF NOT EXISTS hotels jsonb DEFAULT '[]';
ALTER TABLE events ADD COLUMN IF NOT EXISTS survey_questions jsonb DEFAULT '[]';
ALTER TABLE events ADD COLUMN IF NOT EXISTS gift_registry_enabled boolean DEFAULT true;

-- BUGS PROTAGONISTAS
ALTER TABLE events ADD COLUMN IF NOT EXISTS institucion text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS career text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS chambelanes text;
