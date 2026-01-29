const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const logger = require('../utils/logger');

const runMigrations = require('./migrationHandler');

module.exports = runMigrations;

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
