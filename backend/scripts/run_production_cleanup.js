require('dotenv').config();
const readline = require('readline');

/**
 * Production Database Cleanup Runner
 * Connects to production database and runs cleanup
 * Run with: node scripts/run_production_cleanup.js
 */

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n========================================');
console.log('🧹 PRODUCTION DATABASE CLEANUP');
console.log('========================================\n');

console.log('⚠️  WARNING: This will connect to your PRODUCTION database!');
console.log('');
console.log('What this script does:');
console.log('  ✓ Connects to your production database');
console.log('  ✓ Removes all sample/test users');
console.log('  ✓ Removes sample families, events, etc.');
console.log('  ✓ Preserves admin user and essential data');
console.log('');

// Get production database credentials
console.log('Please provide your PRODUCTION database credentials:');
console.log('(Get these from Render Dashboard → Backend Service → Environment Variables)\n');

let prodConfig = {
    host: '',
    port: '',
    database: '',
    user: '',
    password: ''
};

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function getCredentials() {
    prodConfig.host = await askQuestion('DB_HOST (e.g., spoken01-xxx.aivencloud.com): ');
    prodConfig.port = await askQuestion('DB_PORT (e.g., 22417): ');
    prodConfig.database = await askQuestion('DB_NAME (e.g., defaultdb): ');
    prodConfig.user = await askQuestion('DB_USER (e.g., avnadmin): ');

    // Hide password input
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
                case '\u0004': // Ctrl+D
                    stdin.setRawMode(false);
                    stdin.pause();
                    prodConfig.password = password;
                    process.stdout.write('\n\n');
                    resolve();
                    break;
                case '\u0003': // Ctrl+C
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

async function confirmCleanup() {
    console.log('========================================');
    console.log('CONFIRM PRODUCTION CLEANUP');
    console.log('========================================\n');
    console.log(`You are about to clean data from: ${prodConfig.database} on ${prodConfig.host}`);
    console.log('');

    const confirm = await askQuestion('Type "DELETE SAMPLE DATA" to continue (or anything else to cancel): ');

    if (confirm !== 'DELETE SAMPLE DATA') {
        console.log('\n❌ Cleanup cancelled.');
        process.exit(0);
    }
}

async function runCleanup() {
    console.log('\n🔌 Connecting to production database...\n');

    // Temporarily set environment variables for production
    const originalEnv = { ...process.env };

    process.env.DB_HOST = prodConfig.host;
    process.env.DB_PORT = prodConfig.port;
    process.env.DB_NAME = prodConfig.database;
    process.env.DB_USER = prodConfig.user;
    process.env.DB_PASSWORD = prodConfig.password;
    process.env.DB_SSL = 'true'; // Production databases usually require SSL
    process.env.NODE_ENV = 'production';

    try {
        // Import cleanup script
        const cleanSampleData = require('../src/database/clean_sample_data');

        // Note: The clean_sample_data script will handle the actual cleanup
        // We've already set the environment variables, so it will connect to production
        console.log('✅ Environment configured for production database');
        console.log('⏳ Starting cleanup in 3 seconds...\n');

        await new Promise(resolve => setTimeout(resolve, 3000));

        // The script exports a function, so we can call it
        await cleanSampleData();

    } catch (error) {
        console.error('\n❌ Cleanup failed:', error.message);
        console.error('\nPlease check:');
        console.error('  - Database credentials are correct');
        console.error('  - Database is accessible from your network');
        console.error('  - Firewall/security groups allow your IP');
        process.exit(1);
    } finally {
        // Restore original environment
        process.env = originalEnv;
        rl.close();
    }
}

async function main() {
    try {
        await getCredentials();
        await confirmCleanup();
        await runCleanup();
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

main();
