require('dotenv').config();
const { Pool } = require('pg');
const readline = require('readline');

/**
 * Check Production Users Script
 * Connects to production database and shows all users
 * Run with: node scripts/check_production_users.js
 */

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n========================================');
console.log('🔍 CHECK PRODUCTION USERS');
console.log('========================================\n');

let prodConfig = {
    host: '',
    port: '',
    database: '',
    user: '',
    password: '',
    ssl: { rejectUnauthorized: false } // Required for cloud databases
};

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function getCredentials() {
    console.log('Enter your PRODUCTION database credentials:');
    console.log('(From Render Dashboard → Environment Variables)\n');

    prodConfig.host = await askQuestion('DB_HOST: ');
    prodConfig.port = await askQuestion('DB_PORT: ');
    prodConfig.database = await askQuestion('DB_NAME: ');
    prodConfig.user = await askQuestion('DB_USER: ');

    // Password input
    process.stdout.write('DB_PASSWORD: ');
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let password = '';

    return new Promise((resolve) => {
        stdin.on('data', function (char) {
            char = char.toString('utf8');

            switch (char) {
                case '\n':
                case '\r':
                case '\u0004':
                    stdin.setRawMode(false);
                    stdin.pause();
                    prodConfig.password = password;
                    process.stdout.write('\n\n');
                    resolve();
                    break;
                case '\u0003':
                    process.exit();
                    break;
                default:
                    password += char;
                    process.stdout.write('*');
                    break;
            }
        });
    });
}

async function checkUsers() {
    const pool = new Pool(prodConfig);

    try {
        console.log('🔌 Connecting to production database...\n');

        const result = await pool.query(`
            SELECT 
                u.id,
                u.email,
                u.role,
                u.is_active,
                u.created_at,
                u.last_login,
                m.first_name,
                m.last_name
            FROM users u
            LEFT JOIN members m ON m.user_id = u.id
            ORDER BY u.created_at ASC
        `);

        if (result.rows.length === 0) {
            console.log('❌ No users found in database!\n');
            return;
        }

        console.log(`📊 Found ${result.rows.length} user(s) in production:\n`);
        console.log('='.repeat(100));

        const sampleEmails = [
            'john.mwangi@example.com',
            'mary.mwangi@example.com',
            'david.ochieng@example.com',
            'grace.ochieng@example.com',
            'peter.kamau@example.com',
            'jane.kamau@example.com'
        ];

        let sampleCount = 0;

        result.rows.forEach((user, index) => {
            const isSample = sampleEmails.includes(user.email);
            if (isSample) sampleCount++;

            console.log(`\nUser #${index + 1}:${isSample ? ' ⚠️  SAMPLE DATA' : ''}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Active: ${user.is_active}`);
            console.log(`  Name: ${user.first_name || 'N/A'} ${user.last_name || ''}`);
            console.log(`  Created: ${user.created_at}`);
            console.log(`  Last Login: ${user.last_login || 'Never'}`);
            console.log('-'.repeat(100));
        });

        console.log(`\n📈 Summary:`);
        console.log(`  Total users: ${result.rows.length}`);
        console.log(`  Sample/test users: ${sampleCount}`);
        console.log(`  Real users: ${result.rows.length - sampleCount}`);

        if (sampleCount > 0) {
            console.log(`\n⚠️  You have ${sampleCount} sample user(s) in production!`);
            console.log(`Run the cleanup script to remove them: node scripts/run_production_cleanup.js\n`);
        } else {
            console.log(`\n✅ No sample users found. Production database is clean!\n`);
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nPlease check:');
        console.error('  - Database credentials are correct');
        console.error('  - Database is accessible from your network');
        console.error('  - Your IP is allowed in database firewall');
    } finally {
        await pool.end();
        rl.close();
    }
}

async function main() {
    try {
        await getCredentials();
        await checkUsers();
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

main();
