require('dotenv').config();
const db = require('../src/config/database');

/**
 * Add events RBAC permissions for admin, secretary, and leader roles
 */
async function addEventsPermissions() {
    try {
        console.log('🔄 Adding events permissions...\n');

        const result = await db.query(`
            INSERT INTO permissions (role, resource, action, is_allowed) 
            VALUES 
                ('admin', 'events', 'create', true),
                ('admin', 'events', 'read', true),
                ('admin', 'events', 'update', true),
                ('admin', 'events', 'delete', true),
                ('secretary', 'events', 'create', true),
                ('secretary', 'events', 'read', true),
                ('secretary', 'events', 'update', true),
                ('leader', 'events', 'create', true),
                ('leader', 'events', 'read', true),
                ('finance', 'events', 'read', true),
                ('member', 'events', 'read', true)
            ON CONFLICT (role, resource, action) DO NOTHING
            RETURNING role, resource, action
        `);

        console.log(`✅ Added ${result.rows.length} new permissions\n`);

        // Verify all events permissions
        const verify = await db.query(`
            SELECT role, action FROM permissions 
            WHERE resource = 'events'
            ORDER BY role, action
        `);

        console.log('Current events permissions:');
        const grouped = {};
        verify.rows.forEach(row => {
            if (!grouped[row.role]) grouped[row.role] = [];
            grouped[row.role].push(row.action);
        });

        Object.entries(grouped).forEach(([role, actions]) => {
            console.log(`  ✓ ${role.padEnd(12)} | ${actions.join(', ')}`);
        });

        console.log('\n✅ Events permissions configured!');
        console.log('\nWho can create events:');
        console.log('  - admin (full access)');
        console.log('  - secretary (create, read, update)');
        console.log('  - leader (create, read)');
        console.log('\nWho can view events:');
        console.log('  - All roles can view events\n');

    } catch (error) {
        console.error('❌ Failed to add permissions:', error.message);
        throw error;
    } finally {
        await db.pool.end();
    }
}

// Run
addEventsPermissions()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
