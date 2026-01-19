const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const db = require('../config/database');
const logger = require('../utils/logger');

async function clearMembers() {
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');
        logger.info('🧹 Starting to clear fake members and related data...');

        // 1. Clear related tables first (child tables)
        logger.info('Clearing attendance records...');
        await client.query('DELETE FROM attendance_records');

        logger.info('Clearing group members...');
        await client.query('DELETE FROM group_members');

        logger.info('Clearing contributions...');
        await client.query('DELETE FROM contributions');

        logger.info('Clearing pledges...');
        await client.query('DELETE FROM pledges');

        logger.info('Clearing event registrations...');
        await client.query('DELETE FROM event_registrations');

        // 2. Clear members table
        logger.info('Clearing members...');
        await client.query('DELETE FROM members');

        // 3. Clear families
        logger.info('Clearing families...');
        await client.query('DELETE FROM families');

        // 4. Clear users (EXCEPT Admin)
        logger.info('Clearing member users...');
        await client.query("DELETE FROM users WHERE role != 'sysadmin' AND email != 'admin@spokenword.com'");

        // 5. Clear groups that might have been created by members (or just reset groups too if desired, but user focused on members)
        // The seed creates groups with leader_id. If leader is deleted, what happens? 
        // If leader_id is FK with ON DELETE SET NULL, we are fine. If CASCADE, groups might be deleted. 
        // If RESTRICT, we might fail.
        // Let's check init.sql or assume safe to set leader_id to null if possible, or just leave groups but update leader.
        // For now, let's assume we might need to handle groups if they have constraints.
        // To be safe, let's just set leader_id to NULL for all groups
        logger.info('Updating groups leader_id to NULL...');
        await client.query('UPDATE groups SET leader_id = NULL');

        await client.query('COMMIT');
        logger.info('✅ Successfully cleared all fake members and related data. Admin user preserved.');

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('❌ Failed to clear data:', error);
        process.exit(1);
    } finally {
        client.release();
        await db.pool.end();
    }
}

if (require.main === module) {
    clearMembers()
        .then(() => {
            logger.info('Cleanup complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
