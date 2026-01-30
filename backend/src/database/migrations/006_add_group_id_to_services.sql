-- Add group_id column to services table for group-specific services
ALTER TABLE services ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_services_group_id ON services(group_id);

-- Add comment
COMMENT ON COLUMN services.group_id IS 'Optional: if set, service is specific to this group. If NULL, service is church-wide';
