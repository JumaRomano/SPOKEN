-- Add group_id to funds table to support group-specific funds
ALTER TABLE funds ADD COLUMN group_id UUID REFERENCES groups(id) ON DELETE CASCADE;
CREATE INDEX idx_funds_group_id ON funds(group_id);
