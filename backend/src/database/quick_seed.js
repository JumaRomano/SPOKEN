const bcrypt = require('bcryptjs');
const db = require('../config/database');
const logger = require('../utils/logger');

async function seedAdmin() {
    console.log('🌱 Seeding Admin User...');
    try {
        const hash = await bcrypt.hash('Admin123!', 12);

        // Delete existing if any to avoid duplicates
        await db.query("DELETE FROM users WHERE email = 'admin@spokenword.com'");

        const result = await db.query(`
            INSERT INTO users (email, password_hash, role, status, is_active)
            VALUES ($1, $2, $3, 'active', true)
            RETURNING id, email
        `, ['admin@spokenword.com', hash, 'admin']); // Using 'admin' or 'sysadmin' depending on your schema enum

        console.log('✅ Admin user created:', result.rows[0]);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedAdmin();
