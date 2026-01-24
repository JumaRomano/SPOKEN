const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * TEMPORARY MIGRATION ENDPOINT - NO AUTH REQUIRED
 * Run this once to create the sermons table
 * DELETE THIS FILE after migration is complete
 */
router.post('/run-sermons-migration', async (req, res) => {
    try {
        console.log('🔄 Starting sermons table migration...');

        // Create sermons table
        await db.query(`
            CREATE TABLE IF NOT EXISTS sermons (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                speaker VARCHAR(255),
                series VARCHAR(255),
                description TEXT,
                video_url TEXT NOT NULL,
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create indexes
        await db.query(`CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date DESC)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_sermons_series ON sermons(series)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_sermons_speaker ON sermons(speaker)`);

        // Create trigger (PostgreSQL doesn't support IF NOT EXISTS for triggers, so we'll handle the error)
        try {
            await db.query(`
                CREATE TRIGGER update_sermons_updated_at 
                BEFORE UPDATE ON sermons
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
            `);
        } catch (triggerError) {
            // Trigger might already exist, that's okay
            if (!triggerError.message.includes('already exists')) {
                throw triggerError;
            }
        }

        console.log('✅ Sermons table migration completed successfully!');

        res.json({
            success: true,
            message: 'Sermons table created successfully',
            note: 'Please delete this migration endpoint after use'
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * TEMPORARY MIGRATION ENDPOINT - NO AUTH REQUIRED
 * Run this once to create the events tables
 * DELETE THIS FILE after migration is complete
 */
router.post('/run-events-migration', async (req, res) => {
    try {
        console.log('🔄 Starting events tables migration...');

        // Create events table
        await db.query(`
            CREATE TABLE IF NOT EXISTS events (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                event_name VARCHAR(255) NOT NULL,
                description TEXT,
                event_type VARCHAR(100) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE,
                location VARCHAR(255),
                max_participants INTEGER,
                registration_required BOOLEAN DEFAULT false,
                registration_deadline TIMESTAMP,
                created_by UUID REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create event registrations table
        await db.query(`
            CREATE TABLE IF NOT EXISTS event_registrations (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                attendance_status VARCHAR(50) DEFAULT 'registered',
                payment_status VARCHAR(50),
                amount_paid DECIMAL(10,2),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(event_id, member_id)
            )
        `);

        // Create volunteer roles table
        await db.query(`
            CREATE TABLE IF NOT EXISTS volunteer_roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                role_name VARCHAR(255) NOT NULL,
                description TEXT,
                slots_needed INTEGER NOT NULL DEFAULT 1,
                slots_filled INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create volunteer signups table
        await db.query(`
            CREATE TABLE IF NOT EXISTS volunteer_signups (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                role_id UUID NOT NULL REFERENCES volunteer_roles(id) ON DELETE CASCADE,
                member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
                status VARCHAR(50) DEFAULT 'pending',
                signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(role_id, member_id)
            )
        `);

        // Create indexes
        await db.query(`CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_event_registrations_member_id ON event_registrations(member_id)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_volunteer_roles_event_id ON volunteer_roles(event_id)`);

        // Create/update trigger function
        await db.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql
        `);

        // Create triggers (drop first to avoid errors)
        try {
            await db.query(`DROP TRIGGER IF EXISTS events_updated_at_trigger ON events`);
            await db.query(`
                CREATE TRIGGER events_updated_at_trigger
                BEFORE UPDATE ON events
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column()
            `);
        } catch (err) {
            console.log('Events trigger creation non-critical error:', err.message);
        }

        try {
            await db.query(`DROP TRIGGER IF EXISTS event_registrations_updated_at_trigger ON event_registrations`);
            await db.query(`
                CREATE TRIGGER event_registrations_updated_at_trigger
                BEFORE UPDATE ON event_registrations
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column()
            `);
        } catch (err) {
            console.log('Event registrations trigger creation non-critical error:', err.message);
        }

        console.log('✅ Events tables migration completed successfully!');

        res.json({
            success: true,
            message: 'Events tables created successfully',
            note: 'Please delete this migration endpoint after use'
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
