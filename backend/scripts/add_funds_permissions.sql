-- Add missing RBAC permissions for funds resource
-- This fixes the "Failed to create fund" error

INSERT INTO permissions (role, resource, action, is_allowed) 
VALUES 
    ('finance', 'funds', 'create', true),
    ('finance', 'funds', 'read', true),
    ('finance', 'funds', 'update', true),
    ('admin', 'funds', 'create', true),
    ('admin', 'funds', 'read', true),
    ('admin', 'funds', 'update', true),
    ('admin', 'funds', 'delete', true),
    ('finance', 'pledges', 'create', true),
    ('finance', 'pledges', 'read', true)
ON CONFLICT (role, resource, action) DO NOTHING;

-- Verify the permissions were added
SELECT role, resource, action 
FROM permissions 
WHERE resource IN ('funds', 'pledges')
ORDER BY role, resource, action;
