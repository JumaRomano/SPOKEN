-- Fix events table to use TIMESTAMP instead of DATE for start_date and end_date
ALTER TABLE events 
ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::TIMESTAMP;

ALTER TABLE events 
ALTER COLUMN end_date TYPE TIMESTAMP USING end_date::TIMESTAMP;
