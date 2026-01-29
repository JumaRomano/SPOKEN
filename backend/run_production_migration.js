#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    console.log('🔐 Running Production Database Migration\n');

    // Require all credentials from environment variables for security
    const requiredEnvVars = ['PROD_DB_HOST', 'PROD_DB_PORT', 'PROD_DB_NAME', 'PROD_DB_USER', 'PROD_DB_PASSWORD'];
    const missing = requiredEnvVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        console.error('\nPlease set these variables before running the migration.');
        console.error('Example: PROD_DB_PASSWORD=your_password node run_production_migration.js');
        process.exit(1);
    }

    const password = process.env.PROD_DB_PASSWORD;

    const client = new Client({
        host: process.env.PROD_DB_HOST,
        port: parseInt(process.env.PROD_DB_PORT),
        database: process.env.PROD_DB_NAME,
        user: process.env.PROD_DB_USER,
        password: password,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔌 Connecting to Aiven database...');
        await client.connect();
        console.log('✅ Connected successfully\n');

        const migrationPath = path.join(__dirname, 'src', 'database', 'migrations', '006_add_group_id_to_services.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        console.log('📝 Running migration: 006_add_group_id_to_services.sql');
        console.log('SQL:', migrationSQL);
        console.log('');

        await client.query(migrationSQL);

        console.log('✅ Migration completed successfully!\n');
        console.log('Changes applied:');
        console.log('  ✓ Added group_id column to services table');
        console.log('  ✓ Created index on group_id');
        console.log('\n🎉 Your production database is now up to date!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed\n');
    }
}

runMigration();
