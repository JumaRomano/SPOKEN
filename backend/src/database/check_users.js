const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Check Users Script
 * Lists all users in the database with their details to help debug production users
 */

async function checkUsers() {
    try {
        logger.info('🔍 Checking users in database...');
        logger.info(`Environment: ${process.env.NODE_ENV}`);
        logger.info(`Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
        logger.info('');

        // Get all users
        const result = await db.query(`
            SELECT 
                u.id,
                u.email,
                u.role,
                u.is_active,
                u.created_at,
                u.last_login,
                m.first_name,
                m.last_name,
                m.phone
            FROM users u
            LEFT JOIN members m ON m.user_id = u.id
            ORDER BY u.created_at ASC
        `);

        if (result.rows.length === 0) {
            logger.info('❌ No users found in database!');
            process.exit(0);
        }

        logger.info(`📊 Found ${result.rows.length} user(s):\n`);
        logger.info('='.repeat(120));

        result.rows.forEach((user, index) => {
            logger.info(`User #${index + 1}:`);
            logger.info(`  ID: ${user.id}`);
            logger.info(`  Email: ${user.email}`);
            logger.info(`  Role: ${user.role}`);
            logger.info(`  Active: ${user.is_active}`);
            logger.info(`  Name: ${user.first_name || 'N/A'} ${user.last_name || ''}`);
            logger.info(`  Phone: ${user.phone || 'N/A'}`);
            logger.info(`  Created: ${user.created_at}`);
            logger.info(`  Last Login: ${user.last_login || 'Never'}`);
            logger.info('-'.repeat(120));
        });

        logger.info('\n✅ User check completed');
        process.exit(0);

    } catch (error) {
        logger.error('❌ Error checking users:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    checkUsers();
}

module.exports = checkUsers;
