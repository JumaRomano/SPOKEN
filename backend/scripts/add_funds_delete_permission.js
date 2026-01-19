require('dotenv').config();
const db = require('../src/config/database');

/**
 * Add funds delete permission for finance role
 */
async function addFundsDeletePermission() {
    try {
        console.log('🔄 Adding funds delete permission for finance role...\n');

        const result = await db.query(`
            INSERT INTO permissions (role, resource, action, is_allowed) 
            VALUES ('finance', 'funds', 'delete', true)
            ON CONFLICT (role, resource, action) DO NOTHING
            RETURNING role, resource, action
        `);

        if (result.rows.length > 0) {
            console.log('✅ Permission added successfully!\n');
        } else {
            console.log('ℹ️  Permission already exists\n');
        }

        // Verify all funds permissions for finance role
        const verify = await db.query(`
            SELECT action FROM permissions 
            WHERE resource = 'funds' AND role = 'finance'
            ORDER BY action
        `);

        console.log('Finance role - funds permissions:');
        verify.rows.forEach(row => {
            console.log(`  ✓ funds.${row.action}`);
        });

        console.log('\n✅ Update completed!');

    } catch (error) {
        console.error('❌ Failed to add permission:', error.message);
        throw error;
    } finally {
        await db.pool.end();
    }
}

// Run
addFundsDeletePermission()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
