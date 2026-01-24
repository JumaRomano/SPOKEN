const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Migration Runner
 * Safely runs pending migrations on startup
 */
async function runMigrations() {
    try {
        logger.info('🔍 Checking for pending migrations...');

        // 1. Core Attendance Columns
        await db.query(`
            ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS recorded_by UUID REFERENCES users(id);
            ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id);
            ALTER TABLE group_attendance ADD COLUMN IF NOT EXISTS recorded_by UUID REFERENCES users(id);
            ALTER TABLE group_attendance ADD COLUMN IF NOT EXISTS total_present INTEGER;
        `);

        // 2. Event Columns
        await db.query(`
            ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT false;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_url TEXT;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS cost DECIMAL(10, 2) DEFAULT 0;
            ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS notes TEXT;
            ALTER TABLE volunteer_signups ADD COLUMN IF NOT EXISTS notes TEXT;
        `);

        // 3. User Role Constraint
        await db.query(`
            ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
            ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('member', 'leader', 'finance', 'admin', 'sysadmin', 'secretary'));
        `);

        // 4. Nullability fixes
        await db.query(`
            ALTER TABLE group_attendance ALTER COLUMN member_id DROP NOT NULL;
        `);

        // 5. Critical Permissions for Dashboard & Groups
        const permissions = [
            ['member', 'groups', 'read'],
            ['member', 'members', 'read'],
            ['member', 'members', 'update'],
            ['secretary', 'events', 'create'],
            ['secretary', 'events', 'read'],
            ['secretary', 'events', 'update'],
            ['secretary', 'members', 'read'],
            ['secretary', 'groups', 'read']
        ];

        for (const [role, resource, action] of permissions) {
            await db.query(`
                INSERT INTO permissions (role, resource, action, is_allowed)
                VALUES ($1, $2, $3, true)
                ON CONFLICT (role, resource, action) DO UPDATE SET is_allowed = true
            `, [role, resource, action]);
        }

        logger.info('✅ Production database fixes applied successfully.');
    } catch (error) {
        logger.error('❌ Failed to apply database fixes:', error);
        // Don't crash the server, just log the error
    }
}

module.exports = runMigrations;
