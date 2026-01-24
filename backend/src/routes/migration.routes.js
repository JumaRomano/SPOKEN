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

module.exports = router;
