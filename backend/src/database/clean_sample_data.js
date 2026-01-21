const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Clean Sample Data Script  
 * Removes sample/test data created by seed.js from the database
 * ⚠️ WARNING: This will delete sample users and related data!
 * Only run this on production AFTER confirming you want to remove test data
 */

async function cleanSampleData() {
    const client = await db.pool.connect();

    try {
        logger.info('🧹 Starting sample data cleanup...');
        logger.info(`Environment: ${process.env.NODE_ENV}`);
        logger.info(`Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
        logger.info('');

        // Safety check
        if (process.env.NODE_ENV === 'development') {
            logger.warn('⚠️  Running in DEVELOPMENT mode. Are you sure you want to clean data?');
        }

        await client.query('BEGIN');

        // List of sample emails from seed.js
        const sampleEmails = [
            'john.mwangi@example.com',
            'mary.mwangi@example.com',
            'david.ochieng@example.com',
            'grace.ochieng@example.com',
            'peter.kamau@example.com',
            'jane.kamau@example.com'
        ];

        logger.info('📊 Checking for sample users...\n');

        // Check which sample users exist
        const existingUsers = await client.query(`
            SELECT id, email, role 
            FROM users 
            WHERE email = ANY($1)
            ORDER BY email
        `, [sampleEmails]);

        if (existingUsers.rows.length === 0) {
            logger.info('✅ No sample users found in database. Nothing to clean!');
            await client.query('ROLLBACK');
            process.exit(0);
            return;
        }

        logger.info(`Found ${existingUsers.rows.length} sample user(s):`);
        existingUsers.rows.forEach(user => {
            logger.info(`  - ${user.email} (${user.role})`);
        });
        logger.info('');

        // Get user IDs for deletion
        const userIds = existingUsers.rows.map(u => u.id);

        // Get member IDs associated with these users
        const membersResult = await client.query(`
            SELECT id FROM members WHERE user_id = ANY($1)
        `, [userIds]);
        const memberIds = membersResult.rows.map(m => m.id);

        logger.info('🗑️  Deleting related data...\n');

        // Delete in correct order to respect foreign key constraints

        // 1. Event registrations
        if (memberIds.length > 0) {
            const eventRegsResult = await client.query(`
                DELETE FROM event_registrations WHERE member_id = ANY($1)
                RETURNING id
            `, [memberIds]);
            logger.info(`  ✓ Deleted ${eventRegsResult.rowCount} event registration(s)`);
        }

        // 2. Attendance records
        if (memberIds.length > 0) {
            const attendanceResult = await client.query(`
                DELETE FROM attendance_records WHERE member_id = ANY($1)
                RETURNING id
            `, [memberIds]);
            logger.info(`  ✓ Deleted ${attendanceResult.rowCount} attendance record(s)`);
        }

        // 3. Contributions
        if (memberIds.length > 0) {
            const contributionsResult = await client.query(`
                DELETE FROM contributions WHERE member_id = ANY($1)
                RETURNING id
            `, [memberIds]);
            logger.info(`  ✓ Deleted ${contributionsResult.rowCount} contribution(s)`);
        }

        // 4. Pledges
        if (memberIds.length > 0) {
            const pledgesResult = await client.query(`
                DELETE FROM pledges WHERE member_id = ANY($1)
                RETURNING id
            `, [memberIds]);
            logger.info(`  ✓ Deleted ${pledgesResult.rowCount} pledge(s)`);
        }

        // 5. Group memberships
        if (memberIds.length > 0) {
            const groupMembersResult = await client.query(`
                DELETE FROM group_members WHERE member_id = ANY($1)
                RETURNING id
            `, [memberIds]);
            logger.info(`  ✓ Deleted ${groupMembersResult.rowCount} group membership(s)`);
        }

        // 6. Groups where sample users are leaders
        if (memberIds.length > 0) {
            const groupsResult = await client.query(`
                DELETE FROM groups WHERE leader_id = ANY($1)
                RETURNING id
            `, [memberIds]);
            logger.info(`  ✓ Deleted ${groupsResult.rowCount} group(s)`);
        }

        // 7. Delete members
        if (memberIds.length > 0) {
            const membersDeleteResult = await client.query(`
                DELETE FROM members WHERE id = ANY($1)
                RETURNING id
            `, [memberIds]);
            logger.info(`  ✓ Deleted ${membersDeleteResult.rowCount} member profile(s)`);
        }

        // 8. Delete users
        const usersResult = await client.query(`
            DELETE FROM users WHERE id = ANY($1)
            RETURNING id, email
        `, [userIds]);
        logger.info(`  ✓ Deleted ${usersResult.rowCount} user(s)`);

        // Optional: Clean up sample families, events, announcements, services
        logger.info('\n🗑️  Cleaning up other sample data...\n');

        // Delete sample families (Mwangi, Ochieng, Kamau)
        const familiesResult = await client.query(`
            DELETE FROM families 
            WHERE family_name IN ('Mwangi Family', 'Ochieng Family', 'Kamau Family')
            RETURNING id, family_name
        `);
        logger.info(`  ✓ Deleted ${familiesResult.rowCount} sample familie(s)`);

        // Delete sample events
        const eventsResult = await client.query(`
            DELETE FROM events 
            WHERE event_name = 'Annual Church Retreat'
            RETURNING id, event_name
        `);
        logger.info(`  ✓ Deleted ${eventsResult.rowCount} sample event(s)`);

        // Delete sample announcements
        const announcementsResult = await client.query(`
            DELETE FROM announcements 
            WHERE title IN ('Welcome New Members', 'Youth Ministry Meeting')
            RETURNING id, title
        `);
        logger.info(`  ✓ Deleted ${announcementsResult.rowCount} sample announcement(s)`);

        await client.query('COMMIT');

        logger.info('\n✅ Sample data cleanup completed successfully!');
        logger.info('\n========================================');
        logger.info('NEXT STEPS:');
        logger.info('========================================');
        logger.info('1. Verify the admin account still exists:');
        logger.info('   Email: admin@spokenword.com');
        logger.info('2. Add your real members through the application');
        logger.info('3. Consider updating the seed script to only create admin in production');
        logger.info('========================================\n');

        process.exit(0);

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('❌ Cleanup failed:', error);
        logger.error('Database has been rolled back. No changes were made.');
        process.exit(1);
    } finally {
        client.release();
        await db.pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    logger.warn('\n⚠️  WARNING: This will delete ALL sample data from the database!');
    logger.warn('This includes sample users, members, families, events, etc.\n');
    logger.warn('Press Ctrl+C within 5 seconds to cancel...\n');

    setTimeout(() => {
        cleanSampleData();
    }, 5000);
}

module.exports = cleanSampleData;
