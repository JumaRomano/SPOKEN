/**
 * Quick check of production database users
 * Uses environment variables for security
 */

const { Pool } = require('pg');

const prodConfig = {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    database: process.env.PROD_DB_NAME,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
};

async function checkUsers() {
    const pool = new Pool(prodConfig);

    try {
        const result = await pool.query(`
            SELECT 
                u.id,
                u.email,
                u.role,
                u.is_active,
                m.first_name,
                m.last_name
            FROM users u
            LEFT JOIN members m ON m.user_id = u.id
            ORDER BY u.created_at ASC
        `);

        console.log(`\n📊 Production Database Users: ${result.rows.length}\n`);
        console.log('='.repeat(80));

        result.rows.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Name: ${user.first_name || 'N/A'} ${user.last_name || ''}`);
        });

        console.log('\n' + '='.repeat(80));
        console.log(`\n✅ Total: ${result.rows.length} user(s)\n`);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkUsers();
