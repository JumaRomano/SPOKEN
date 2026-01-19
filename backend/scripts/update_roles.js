require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function run() {
    try {
        console.log('Updating roles constraint...');
        await pool.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;`);
        await pool.query(`ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('member', 'leader', 'finance', 'admin', 'sysadmin', 'secretary', 'chairman'));`);
        console.log('Roles constraint updated successfully.');

        // Also update permissions for new roles
        console.log('Updating permissions...');
        // Secretary
        await pool.query(`INSERT INTO permissions (role, resource, action, is_allowed) VALUES 
            ('secretary', 'attendance', 'create', true),
            ('secretary', 'attendance', 'read', true),
            ('secretary', 'attendance', 'update', true),
            ('secretary', 'members', 'read', true),
            ('secretary', 'members', 'update', true),
            ('secretary', 'communications', 'create', true)
            ON CONFLICT (role, resource, action) DO NOTHING;`);

        // Chairman permissions (High level read access usually)
        await pool.query(`INSERT INTO permissions (role, resource, action, is_allowed) VALUES 
            ('chairman', 'reports', 'read', true),
            ('chairman', 'finance', 'read', true),
            ('chairman', 'members', 'read', true),
            ('chairman', 'groups', 'read', true)
            ON CONFLICT (role, resource, action) DO NOTHING;`);

        console.log('Permissions updated.');
        process.exit(0);
    } catch (e) {
        console.error('Error updating roles:', e);
        process.exit(1);
    }
}

run();
