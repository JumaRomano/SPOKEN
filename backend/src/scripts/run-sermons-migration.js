#!/usr/bin/env node

/**
 * Migration Runner for Production
 * Runs the sermons table migration
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🔄 Running migration: 002_add_sermons_table.sql');

        // Read migration file
        const migrationPath = path.join(__dirname, '..', 'database', 'migrations', '002_add_sermons_table.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        // Execute migration
        await client.query('BEGIN');
        await client.query(migrationSQL);
        await client.query('COMMIT');

        console.log('✅ Migration completed successfully!');
        console.log('📊 Sermons table created with indexes and triggers');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
