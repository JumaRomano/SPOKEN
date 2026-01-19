require('dotenv').config();
const db = require('../src/config/database');

/**
 * Add groups read permission for finance role
 */
async function addGroupsReadPermission() {
    try {
        console.log('🔄 Adding groups read permission for finance role...\n');

        const result = await db.query(`
            INSERT INTO permissions (role, resource, action, is_allowed) 
            VALUES ('finance', 'groups', 'read', true)
            ON CONFLICT (role, resource, action) DO NOTHING
            RETURNING role, resource, action
        `);

        if (result.rows.length > 0) {
            console.log('✅ Permission added successfully!\n');
        } else {
            console.log('ℹ️  Permission already exists\n');
        }

        console.log('✅ Update completed!');

    } catch (error) {
        console.error('❌ Failed to add permission:', error.message);
        throw error;
    } finally {
        await db.pool.end();
    }
}

// Run
addGroupsReadPermission()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
