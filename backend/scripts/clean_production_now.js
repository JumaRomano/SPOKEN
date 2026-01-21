/**
 * Direct Production Cleanup (Non-Interactive)
 * Uses environment variables for credentials
 * NEVER hardcode production credentials!
 */

const { Pool } = require('pg');

// Production database config from environment variables
const prodConfig = {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    database: process.env.PROD_DB_NAME,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
};

const sampleEmails = [
    'john.mwangi@example.com',
    'mary.mwangi@example.com',
    'david.ochieng@example.com',
    'grace.ochieng@example.com',
    'peter.kamau@example.com',
    'jane.kamau@example.com'
];

async function cleanProductionDatabase() {
    const pool = new Pool(prodConfig);
    const client = await pool.connect();

    try {
        console.log('\n🧹 Starting Production Database Cleanup...');
        console.log(`Database: ${prodConfig.database} on ${prodConfig.host}\n`);

        await client.query('BEGIN');

        // Get sample user IDs
        const usersResult = await client.query(`
            SELECT id, email FROM users WHERE email = ANY($1)
        `, [sampleEmails]);

        if (usersResult.rows.length === 0) {
            console.log('✅ No sample users found. Database is already clean!\n');
            await client.query('ROLLBACK');
            return;
        }

        console.log(`Found ${usersResult.rows.length} sample user(s):`);
        usersResult.rows.forEach(u => console.log(`  - ${u.email}`));
        console.log('');

        const userIds = usersResult.rows.map(u => u.id);

        // Get member IDs
        const membersResult = await client.query(`
            SELECT id FROM members WHERE user_id = ANY($1)
        `, [userIds]);
        const memberIds = membersResult.rows.map(m => m.id);

        console.log('🗑️  Deleting related data...\n');

        // Delete cascade
        if (memberIds.length > 0) {
            await client.query(`DELETE FROM event_registrations WHERE member_id = ANY($1)`, [memberIds]);
            console.log('  ✓ Event registrations');

            await client.query(`DELETE FROM attendance_records WHERE member_id = ANY($1)`, [memberIds]);
            console.log('  ✓ Attendance records');

            await client.query(`DELETE FROM contributions WHERE member_id = ANY($1)`, [memberIds]);
            console.log('  ✓ Contributions');

            await client.query(`DELETE FROM pledges WHERE member_id = ANY($1)`, [memberIds]);
            console.log('  ✓ Pledges');

            await client.query(`DELETE FROM group_members WHERE member_id = ANY($1)`, [memberIds]);
            console.log('  ✓ Group memberships');

            await client.query(`DELETE FROM groups WHERE leader_id = ANY($1)`, [memberIds]);
            console.log('  ✓ Groups');

            await client.query(`DELETE FROM members WHERE id = ANY($1)`, [memberIds]);
            console.log('  ✓ Member profiles');
        }

        await client.query(`DELETE FROM users WHERE id = ANY($1)`, [userIds]);
        console.log('  ✓ User accounts');

        // Clean sample data
        await client.query(`DELETE FROM families WHERE family_name IN ('Mwangi Family', 'Ochieng Family', 'Kamau Family')`);
        console.log('  ✓ Sample families');

        await client.query(`DELETE FROM events WHERE event_name = 'Annual Church Retreat'`);
        console.log('  ✓ Sample events');

        await client.query(`DELETE FROM announcements WHERE title IN ('Welcome New Members', 'Youth Ministry Meeting')`);
        console.log('  ✓ Sample announcements');

        await client.query('COMMIT');

        console.log('\n✅ Production cleanup completed successfully!');
        console.log('\n========================================');
        console.log('NEXT STEPS:');
        console.log('========================================');
        console.log('1. Login to production as admin@spokenword.com');
        console.log('2. Change the admin password immediately');
        console.log('3. Start adding real church members');
        console.log('========================================\n');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n❌ Cleanup failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run cleanup
cleanProductionDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
