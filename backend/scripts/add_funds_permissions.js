require('dotenv').config();
const db = require('../src/config/database');

/**
 * Add missing RBAC permissions for funds resource
 */
async function addFundsPermissions() {
    try {
        console.log('🔄 Adding missing funds permissions...\n');

        const result = await db.query(`
            INSERT INTO permissions (role, resource, action, is_allowed) 
            VALUES 
                ('finance', 'funds', 'create', true),
                ('finance', 'funds', 'read', true),
                ('finance', 'funds', 'update', true),
                ('admin', 'funds', 'create', true),
                ('admin', 'funds', 'read', true),
                ('admin', 'funds', 'update', true),
                ('admin', 'funds', 'delete', true),
                ('finance', 'pledges', 'create', true),
                ('finance', 'pledges', 'read', true)
            ON CONFLICT (role, resource, action) DO NOTHING
            RETURNING role, resource, action
        `);

        console.log(`✅ Added ${result.rows.length} new permissions\n`);

        // Verify all funds permissions
        const verify = await db.query(`
            SELECT role, resource, action FROM permissions 
            WHERE resource IN ('funds', 'pledges')
            ORDER BY role, resource, action
        `);

        console.log('Current funds/pledges permissions:');
        verify.rows.forEach(row => {
            console.log(`  ✓ ${row.role.padEnd(10)} | ${row.resource.padEnd(15)} | ${row.action}`);
        });

        console.log('\n✅ Permissions update completed successfully!');
        console.log('\n👉 You can now create funds in the application.');
        console.log('   Navigate to /finance → Funds tab → Create Fund\n');

    } catch (error) {
        console.error('❌ Failed to add permissions:', error.message);
        console.error(error);
        throw error;
    } finally {
        // Close the pool to allow the process to exit
        await db.pool.end();
    }
}

// Run
addFundsPermissions()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
