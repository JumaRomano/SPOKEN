require('dotenv').config();
const { Pool } = require('pg');
const readline = require('readline');

/**
 * Grant Attendance Permissions Script
 * Grant reading/creating attendance to leader, secretary and admin roles
 */

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => rl.question(question, (answer) => resolve(answer)));
}

async function run() {
    console.log('\n========================================');
    console.log('🛡️  GRANT ATTENDANCE PERMISSIONS');
    console.log('========================================\n');

    console.log('1. Use .env credentials (development)');
    console.log('2. Enter credentials manually (production)');

    const choice = await askQuestion('\nChoice (1/2): ');

    let config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    };

    if (choice === '2') {
        config.host = await askQuestion('DB_HOST: ');
        config.port = await askQuestion('DB_PORT: ');
        config.database = await askQuestion('DB_NAME: ');
        config.user = await askQuestion('DB_USER: ');
        config.password = await askQuestion('DB_PASSWORD: ');
        config.ssl = { rejectUnauthorized: false };
    }

    const pool = new Pool(config);

    try {
        console.log('\n🔌 Connecting to database...');
        await pool.query('SELECT NOW()');
        console.log('✅ Connected.\n');

        const permissions = [
            // Leader
            { role: 'leader', resource: 'attendance', action: 'read' },
            { role: 'leader', resource: 'attendance', action: 'create' },
            { role: 'leader', resource: 'attendance', action: 'update' },

            // Secretary
            { role: 'secretary', resource: 'attendance', action: 'read' },
            { role: 'secretary', resource: 'attendance', action: 'create' },
            { role: 'secretary', resource: 'attendance', action: 'update' },

            // Admin
            { role: 'admin', resource: 'attendance', action: 'read' },
            { role: 'admin', resource: 'attendance', action: 'create' },
            { role: 'admin', resource: 'attendance', action: 'update' },
            { role: 'admin', resource: 'attendance', action: 'delete' },
        ];

        console.log('📝 Granting permissions...');

        for (const p of permissions) {
            await pool.query(`
                INSERT INTO permissions (role, resource, action, is_allowed) 
                VALUES ($1, $2, $3, true)
                ON CONFLICT (role, resource, action) DO UPDATE SET is_allowed = true;
            `, [p.role, p.resource, p.action]);
            console.log(`  ✓ Grant ${p.action} on ${p.resource} to ${p.role}`);
        }

        console.log('\n✅ All permissions granted successfully!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await pool.end();
        rl.close();
    }
}

run();
