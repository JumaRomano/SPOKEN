-- Grant full attendance management permissions to Secretary
INSERT INTO permissions (role, resource, action, is_allowed) VALUES 
('secretary', 'attendance', 'create', true),
('secretary', 'attendance', 'read', true),
('secretary', 'attendance', 'update', true),
('secretary', 'attendance', 'delete', true)
ON CONFLICT (role, resource, action) DO UPDATE SET is_allowed = true;

-- Ensure they can also manage minutes (redundant if 009 ran, but safe)
INSERT INTO permissions (role, resource, action, is_allowed) VALUES 
('secretary', 'minutes', 'create', true),
('secretary', 'minutes', 'read', true),
('secretary', 'minutes', 'update', true),
('secretary', 'minutes', 'delete', true)
ON CONFLICT (role, resource, action) DO UPDATE SET is_allowed = true;
