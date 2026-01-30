-- Create meeting_minutes table
CREATE TABLE meeting_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
    content TEXT NOT NULL,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_minute_date ON meeting_minutes(meeting_date);
CREATE INDEX idx_minute_group ON meeting_minutes(group_id);

-- Add permissions
INSERT INTO permissions (role, resource, action, is_allowed) VALUES
('secretary', 'minutes', 'create', true),
('secretary', 'minutes', 'read', true),
('secretary', 'minutes', 'update', true),
('secretary', 'minutes', 'delete', true),
('admin', 'minutes', 'create', true),
('admin', 'minutes', 'read', true),
('admin', 'minutes', 'update', true),
('admin', 'minutes', 'delete', true),
('sysadmin', 'minutes', '*', true);
