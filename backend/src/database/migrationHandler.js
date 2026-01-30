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

        // Services Table Fixes
        if (!(await checkColumn('services', 'description'))) {
            await db.query('ALTER TABLE services ADD COLUMN description TEXT');
        }
        if (!(await checkColumn('services', 'created_by'))) {
            await db.query('ALTER TABLE services ADD COLUMN created_by UUID REFERENCES users(id)');
        }
        if (!(await checkColumn('services', 'group_id'))) {
            await db.query('ALTER TABLE services ADD COLUMN group_id UUID REFERENCES groups(id)');
        }

        // 3. User Role Constraint
        await db.query(`
            ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
            ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('member', 'leader', 'finance', 'admin', 'sysadmin', 'secretary'));
            
            -- Relax event_type constraints
            ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_type_check;
            
            -- Relax service_type constraints (for attendance)
            ALTER TABLE services DROP CONSTRAINT IF EXISTS services_service_type_check;
            ALTER TABLE services ALTER COLUMN service_name DROP NOT NULL;
            
            -- Relax announcement_type constraints (allow priority values)
            ALTER TABLE announcements DROP CONSTRAINT IF EXISTS announcements_announcement_type_check;
        `);

        // 4. Nullability fixes
        await db.query('ALTER TABLE group_attendance ALTER COLUMN member_id DROP NOT NULL');

        // Create meeting_minutes table if not exists
        await db.query(`
            CREATE TABLE IF NOT EXISTS meeting_minutes (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
                content TEXT NOT NULL,
                group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
                created_by UUID REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

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
            ['secretary', 'announcements', 'create'],
            ['secretary', 'announcements', 'read'],
            ['secretary', 'announcements', 'update'],
            ['secretary', 'announcements', 'delete'],

            // Minutes permissions
            ['secretary', 'minutes', 'create'],
            ['secretary', 'minutes', 'read'],
            ['secretary', 'minutes', 'update'],
            ['secretary', 'minutes', 'delete'],


            // Attendance delete permissions for Secretary
            ['secretary', 'attendance', 'delete'],

            // Finance permissions for Secretary
            ['secretary', 'finance', 'read'],
            ['secretary', 'finance', 'create'],
            ['secretary', 'finance', 'update'],

            // Finance role permissions
            ['finance', 'finance', 'create'],
            ['finance', 'finance', 'read'],
            ['finance', 'finance', 'update'],
            ['finance', 'finance', 'delete'],
            ['finance', 'contributions', 'create'],
            ['finance', 'contributions', 'read'],
            ['finance', 'contributions', 'update'],
            ['finance', 'members', 'read'],
            ['finance', 'events', 'read'],

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
