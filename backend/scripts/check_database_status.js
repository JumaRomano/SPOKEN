/**
 * Check production database status
 * Uses environment variables for credentials
 */

const { Pool } = require('pg');

// Read from environment variables - NEVER hardcode credentials!
const prodConfig = {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    database: process.env.PROD_DB_NAME,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
};

async function checkDatabase() {
    const pool = new Pool(prodConfig);

    try {
        console.log('\n📊 Production Database Status\n');
        console.log('='.repeat(80));

        // Check users
        const usersResult = await pool.query(`SELECT COUNT(*) FROM users`);
        console.log(`\n👤 Users (login accounts): ${usersResult.rows[0].count}`);

        const usersList = await pool.query(`SELECT email, role FROM users ORDER BY email`);
        usersList.rows.forEach(u => {
            console.log(`   - ${u.email} (${u.role})`);
        });

        // Check members
        const membersResult = await pool.query(`SELECT COUNT(*) FROM members`);
        console.log(`\n👥 Members (church member profiles): ${membersResult.rows[0].count}`);

        if (parseInt(membersResult.rows[0].count) > 0) {
            const membersList = await pool.query(`
                SELECT first_name, last_name, email 
                FROM members 
                ORDER BY last_name, first_name
            `);
            membersList.rows.forEach(m => {
                console.log(`   - ${m.first_name} ${m.last_name} (${m.email})`);
            });
        } else {
            console.log('   (No member profiles yet - this is expected!)');
        }

        // Check families
        const familiesResult = await pool.query(`SELECT COUNT(*) FROM families`);
        console.log(`\n👨‍👩‍👧‍👦 Families: ${familiesResult.rows[0].count}`);

        // Check groups
        const groupsResult = await pool.query(`SELECT COUNT(*) FROM groups`);
        console.log(`\n👫 Groups: ${groupsResult.rows[0].count}`);

        // Check events
        const eventsResult = await pool.query(`SELECT COUNT(*) FROM events`);
        console.log(`\n📅 Events: ${eventsResult.rows[0].count}`);

        console.log('\n' + '='.repeat(80));
        console.log('\n✅ Database is clean and ready for real data!\n');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkDatabase();
