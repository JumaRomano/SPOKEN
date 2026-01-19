require('dotenv').config();
const db = require('../src/config/database');

/**
 * Add missing RBAC permissions for members resource
 */
async function addMembersPermissions() {
    try {
        console.log('🔄 Adding missing members permissions...\n');

        await db.query(`
            INSERT INTO permissions (role, resource, action, is_allowed) 
            VALUES 
                ('finance', 'members', 'read', true),
                ('leader', 'members', 'read', true)
            ON CONFLICT (role, resource, action) DO NOTHING
            RETURNING role, resource, action
        `);

        console.log('✅ Permissions added successfully!\n');

        // Verify all members permissions
        const result = await db.query(`
            SELECT role, resource, action FROM permissions 
            WHERE resource = 'members'
            ORDER BY role, action
        `);

        console.log('Current members permissions:');
        result.rows.forEach(row => {
            console.log(`  ✓ ${row.role.padEnd(10)} | ${row.resource.padEnd(15)} | ${row.action}`);
        });

        console.log('\n✅ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Failed to add permissions:', error.message);
        console.error(error);
        throw error;
    } finally {
        await db.pool.end();
    }
}

// Run
addMembersPermissions()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
