require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function run() {
    try {
        console.log('Adding attendance permissions for leader, secretary and admin roles...');

        const roles = ['leader', 'secretary', 'admin'];
        const actions = ['read', 'create', 'update', 'delete'];

        for (const role of roles) {
            for (const action of actions) {
                // Leaders and Secretaries might not need 'delete' but Admin definitely does
                if ((role === 'leader' || role === 'secretary') && action === 'delete') continue;

                await pool.query(`
                    INSERT INTO permissions (role, resource, action, is_allowed) 
                    VALUES ($1, 'attendance', $2, true)
                    ON CONFLICT (role, resource, action) DO UPDATE SET is_allowed = true;
                `, [role, action]);
                console.log(`✅ Added attendance:${action} for ${role}`);
            }
        }

        console.log('Permissions updated successfully.');
        process.exit(0);
    } catch (e) {
        console.error('Error updating permissions:', e);
        process.exit(1);
    }
}

run();
