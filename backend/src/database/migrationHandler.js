const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Migration Runner
 * Safely runs pending migrations on startup with extreme robustness
 */
async function runMigrations() {
    try {
        logger.info('🔍 Checking for pending migrations...');

        // Helper to check if a column exists
        const checkColumn = async (table, column) => {
            const result = await db.query(
                `SELECT column_name FROM information_schema.columns 
                 WHERE table_name = $1 AND column_name = $2`,
                [table, column]
            );
            return result.rows.length > 0;
        };

        // 1. Core Attendance Columns
        if (!(await checkColumn('attendance_records', 'recorded_by'))) {
            await db.query('ALTER TABLE attendance_records ADD COLUMN recorded_by UUID REFERENCES users(id)');
        }
        if (!(await checkColumn('attendance_records', 'group_id'))) {
            await db.query('ALTER TABLE attendance_records ADD COLUMN group_id UUID REFERENCES groups(id)');
        }
        if (!(await checkColumn('group_attendance', 'recorded_by'))) {
            await db.query('ALTER TABLE group_attendance ADD COLUMN recorded_by UUID REFERENCES users(id)');
        }
        if (!(await checkColumn('group_attendance', 'total_present'))) {
            await db.query('ALTER TABLE group_attendance ADD COLUMN total_present INTEGER');
        }

        // 2. Event Columns
        if (!(await checkColumn('events', 'registration_required'))) {
            await db.query('ALTER TABLE events ADD COLUMN registration_required BOOLEAN DEFAULT false');
        }
        if (!(await checkColumn('events', 'banner_url'))) {
            await db.query('ALTER TABLE events ADD COLUMN banner_url TEXT');
        }
        if (!(await checkColumn('events', 'cost'))) {
            await db.query('ALTER TABLE events ADD COLUMN cost DECIMAL(10, 2) DEFAULT 0');
        }
        if (!(await checkColumn('event_registrations', 'notes'))) {
            await db.query('ALTER TABLE event_registrations ADD COLUMN notes TEXT');
        }
        if (!(await checkColumn('volunteer_signups', 'notes'))) {
            await db.query('ALTER TABLE volunteer_signups ADD COLUMN notes TEXT');
        }

        // 3. User Role Constraint
        await db.query(`
            ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
            ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('member', 'leader', 'finance', 'admin', 'sysadmin', 'secretary'));
        `);

        // 4. Nullability fixes
        await db.query('ALTER TABLE group_attendance ALTER COLUMN member_id DROP NOT NULL');

        // 5. Expand Permissions
        const permissions = [
            // Member permissions
            ['member', 'groups', 'read'],
            ['member', 'members', 'read'],
            ['member', 'members', 'update'],
            ['member', 'events', 'read'],
            ['member', 'contributions', 'read'],
            ['member', 'attendance', 'read'],

            // Secretary permissions (expanded)
            ['secretary', 'events', 'create'],
            ['secretary', 'events', 'read'],
            ['secretary', 'events', 'update'],
            ['secretary', 'events', 'delete'],
            ['secretary', 'members', 'read'],
            ['secretary', 'members', 'create'],
            ['secretary', 'members', 'update'],
            ['secretary', 'groups', 'read'],
            ['secretary', 'groups', 'update'],
            ['secretary', 'attendance', 'read'],
            ['secretary', 'attendance', 'create'],
            ['secretary', 'attendance', 'update'],

            // Critical wildcards
            ['admin', '*', '*'],
            ['sysadmin', '*', '*']
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
    }
}

module.exports = runMigrations;
