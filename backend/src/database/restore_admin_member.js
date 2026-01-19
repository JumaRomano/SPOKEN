const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const db = require('../config/database');
const logger = require('../utils/logger');

async function restoreAdminMember() {
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');
        logger.info('🔧 Checking Admin Member Status...');

        // 1. Get the Admin User ID
        const adminUserResult = await client.query(`
            SELECT id, email FROM users WHERE email = 'admin@spokenword.com'
        `);

        if (adminUserResult.rows.length === 0) {
            throw new Error('Admin user not found! This is critical.');
        }

        const adminUser = adminUserResult.rows[0];
        logger.info(`Found Admin User: ${adminUser.email} (ID: ${adminUser.id})`);

        // 2. Check if a member record exists for this user
        const memberResult = await client.query(`
            SELECT id FROM members WHERE user_id = $1
        `, [adminUser.id]);

        if (memberResult.rows.length > 0) {
            logger.info('✅ Admin already has a member profile. No action needed.');
        } else {
            logger.info('⚠️ Admin has no member profile. Creating one now...');

            // 3. Create a member record for the admin
            await client.query(`
                INSERT INTO members (
                    user_id, first_name, last_name, email, 
                    membership_status, membership_date, gender, marital_status,
                    phone
                )
                VALUES (
                    $1, 'System', 'Admin', $2,
                    'active', CURRENT_DATE, 'other', 'single',
                    '+0000000000'
                )
            `, [adminUser.id, adminUser.email]);

            logger.info('✅ Created Member profile for System Admin.');
        }

        await client.query('COMMIT');

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('❌ Failed to restore admin member:', error);
        process.exit(1);
    } finally {
        client.release();
        await db.pool.end();
    }
}

if (require.main === module) {
    restoreAdminMember()
        .then(() => {
            logger.info('Process complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
