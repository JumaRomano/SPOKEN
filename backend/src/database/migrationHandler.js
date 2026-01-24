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
        `);

        // 3. Nullability fixes
        await db.query(`
            ALTER TABLE group_attendance ALTER COLUMN member_id DROP NOT NULL;
        `);

        // 4. Critical Permissions for Dashboard & Groups
        const permissions = [
            ['member', 'groups', 'read'],
            ['member', 'members', 'read'],
            ['member', 'members', 'update']
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
