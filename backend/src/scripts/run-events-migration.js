const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

async function runEventsMigration() {
    try {
        console.log('Starting events tables migration...');

        // Read the SQL migration file
        const migrationPath = path.join(__dirname, '../database/migrations/003_add_events_tables.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Executing SQL migration...');

        // Execute the SQL
        await db.query(sql);

        console.log('✅ Events tables migration completed successfully!');
        logger.info('Events tables migration completed successfully');

        return {
            success: true,
            message: 'Events tables created successfully'
        };
    } catch (error) {
        console.error('❌ Error running events migration:', error);
        logger.error('Events migration error:', error);
        throw error;
    }
}

module.exports = { runEventsMigration };
