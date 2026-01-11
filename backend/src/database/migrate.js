const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const logger = require('../utils/logger');

async function runMigrations() {
    try {
        logger.info('Starting database migrations...');

        // Read the schema SQL file
        const schemaPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema
        await db.query(schema);

        logger.info('✅ Database migrations completed successfully');
    } catch (error) {
        logger.error('❌ Migration failed:', error);
        throw error;
    } finally {
        // Close database connection
        await db.pool.end();
    }
}

// Run migrations if called directly
if (require.main === module) {
    runMigrations()
        .then(() => {
            logger.info('Migration process completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Migration process failed:', error);
            process.exit(1);
        });
}

module.exports = runMigrations;
