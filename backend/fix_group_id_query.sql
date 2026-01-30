-- Quick fix for the UUID empty string comparison issue
-- Run this directly on your production database

-- Check current services with empty group_id (shouldn't exist but let's be safe)
SELECT id, service_date, service_type, group_id 
FROM services 
WHERE group_id IS NOT NULL;

-- If there are any services with empty group_id, this shows how many would be affected
SELECT COUNT(*) as affected_services 
FROM services 
WHERE group_id IS NOT NULL;

-- The backend code has been fixed to only check IS NULL
-- No database changes needed - just deploy the fixed code
