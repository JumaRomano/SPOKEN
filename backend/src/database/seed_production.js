const bcrypt = require('bcryptjs');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Production Seed Script
 * Only creates the admin user and essential data (no sample members/test data)
 * This is safe to run on production
 */

async function seedProduction() {
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');
        logger.info('🌱 Starting production database seeding...');
        logger.info(`Environment: ${process.env.NODE_ENV}`);
        logger.info('');

        // =====================================================
        // 1. CREATE ADMIN USER (if doesn't exist)
        // =====================================================
        logger.info('Checking for admin user...');

        const existingAdmin = await client.query(`
            SELECT id, email FROM users WHERE email = 'admin@spokenword.com'
        `);

        let adminUserId;

        if (existingAdmin.rows.length > 0) {
            logger.info('✅ Admin user already exists');
            adminUserId = existingAdmin.rows[0].id;
        } else {
            const adminPassword = await bcrypt.hash('Admin123!', 12);
            const adminResult = await client.query(`
                INSERT INTO users (email, password_hash, role, is_active)
                VALUES ($1, $2, $3, $4)
                RETURNING id, email
            `, ['admin@spokenword.com', adminPassword, 'sysadmin', true]);

            adminUserId = adminResult.rows[0].id;
            logger.info('✅ Admin user created');
        }

        // =====================================================
        // 2. CREATE DEFAULT FUNDS
        // =====================================================
        logger.info('Creating default funds...');

        const existingFunds = await client.query(`SELECT COUNT(*) FROM funds`);

        if (parseInt(existingFunds.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO funds (fund_name, description, fund_type, is_active)
                VALUES 
                    ('General Fund', 'Main church operations and activities', 'general', true),
                    ('Building Fund', 'Church building and facility improvements', 'building', true),
                    ('Missions Fund', 'Support for missions and outreach programs', 'missions', true),
                    ('Benevolence Fund', 'Assistance for members in need', 'benevolence', true)
                ON CONFLICT DO NOTHING
            `);
            logger.info('✅ Created default funds');
        } else {
            logger.info('✅ Funds already exist');
        }

        await client.query('COMMIT');

        logger.info('\n✅ Production database seeding completed successfully!');
        logger.info('');
        logger.info('========================================');
        logger.info('ADMIN LOGIN CREDENTIALS');
        logger.info('========================================');
        logger.info('Email: admin@spokenword.com');
        logger.info('Password: Admin123!');
        logger.info('');
        logger.info('⚠️  IMPORTANT: Change this password after first login!');
        logger.info('========================================\n');

        process.exit(0);

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('❌ Production seeding failed:', error);
        process.exit(1);
    } finally {
        client.release();
        await db.pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    seedProduction();
}

module.exports = seedProduction;
