-- Add missing columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT false;
