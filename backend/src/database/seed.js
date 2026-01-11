const bcrypt = require('bcryptjs');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Database Seeding Script
 * Creates initial sample data for development and testing
 */

async function seedDatabase() {
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');
        logger.info('🌱 Starting database seeding...');

        // =====================================================
        // 1. CREATE DEFAULT ADMIN USER
        // =====================================================
        logger.info('Creating admin user...');
        const adminPassword = await bcrypt.hash('Admin123!', 12);

        const adminResult = await client.query(`
            INSERT INTO users (email, password_hash, role, is_active)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, ['admin@spokenword.com', adminPassword, 'sysadmin', true]);

        const adminUserId = adminResult.rows[0].id;
        logger.info('✅ Admin user created');

        // =====================================================
        // 2. CREATE FUNDS
        // =====================================================
        logger.info('Creating funds...');
        const fundsResult = await client.query(`
            INSERT INTO funds (fund_name, description, fund_type, is_active)
            VALUES 
                ('General Fund', 'Main church operations and activities', 'general', true),
                ('Building Fund', 'Church building and facility improvements', 'building', true),
                ('Missions Fund', 'Support for missions and outreach programs', 'missions', true),
                ('Benevolence Fund', 'Assistance for members in need', 'benevolence', true)
            RETURNING id, fund_name
        `);

        const funds = fundsResult.rows;
        logger.info(`✅ Created ${funds.length} funds`);

        // =====================================================
        // 3. CREATE SAMPLE FAMILIES
        // =====================================================
        logger.info('Creating sample families...');
        const familiesResult = await client.query(`
            INSERT INTO families (family_name, address, phone)
            VALUES 
                ('Mwangi Family', 'Nairobi, Karen Estate', '+254712345678'),
                ('Ochieng Family', 'Kisumu, Milimani Area', '+254723456789'),
                ('Kamau Family', 'Nakuru, Milimani', '+254734567890')
            RETURNING id, family_name
        `);

        const families = familiesResult.rows;
        logger.info(`✅ Created ${families.length} families`);

        // =====================================================
        // 4. CREATE SAMPLE USERS FOR MEMBERS
        // =====================================================
        logger.info('Creating member users...');
        const memberPassword = await bcrypt.hash('Member123!', 12);

        const usersResult = await client.query(`
            INSERT INTO users (email, password_hash, role, is_active)
            VALUES 
                ('john.mwangi@example.com', $1, 'member', true),
                ('mary.mwangi@example.com', $1, 'member', true),
                ('david.ochieng@example.com', $1, 'leader', true),
                ('grace.ochieng@example.com', $1, 'member', true),
                ('peter.kamau@example.com', $1, 'finance', true),
                ('jane.kamau@example.com', $1, 'member', true)
            RETURNING id, email
        `, [memberPassword]);

        const memberUsers = usersResult.rows;
        logger.info(`✅ Created ${memberUsers.length} member users`);

        // =====================================================
        // 5. CREATE SAMPLE MEMBERS
        // =====================================================
        logger.info('Creating sample members...');
        const membersResult = await client.query(`
            INSERT INTO members (
                user_id, family_id, first_name, last_name, date_of_birth, 
                gender, phone, email, membership_status, membership_date, 
                marital_status, occupation
            )
            VALUES 
                ($1, $2, 'John', 'Mwangi', '1980-05-15', 'male', '+254712345678', 
                 'john.mwangi@example.com', 'active', '2020-01-10', 'married', 'Engineer'),
                ($3, $2, 'Mary', 'Mwangi', '1982-08-20', 'female', '+254712345679', 
                 'mary.mwangi@example.com', 'active', '2020-01-10', 'married', 'Teacher'),
                ($4, $5, 'David', 'Ochieng', '1975-03-12', 'male', '+254723456789', 
                 'david.ochieng@example.com', 'active', '2019-06-15', 'married', 'Business Owner'),
                ($6, $5, 'Grace', 'Ochieng', '1978-11-25', 'female', '+254723456790', 
                 'grace.ochieng@example.com', 'active', '2019-06-15', 'married', 'Nurse'),
                ($7, $8, 'Peter', 'Kamau', '1985-07-30', 'male', '+254734567890', 
                 'peter.kamau@example.com', 'active', '2021-03-20', 'married', 'Accountant'),
                ($9, $8, 'Jane', 'Kamau', '1987-09-18', 'female', '+254734567891', 
                 'jane.kamau@example.com', 'active', '2021-03-20', 'married', 'Doctor')
            RETURNING id, first_name, last_name
        `, [
            memberUsers[0].id, families[0].id,
            memberUsers[1].id,
            memberUsers[2].id, families[1].id,
            memberUsers[3].id,
            memberUsers[4].id, families[2].id,
            memberUsers[5].id
        ]);

        const members = membersResult.rows;
        logger.info(`✅ Created ${members.length} members`);

        // =====================================================
        // 6. CREATE SAMPLE GROUPS
        // =====================================================
        logger.info('Creating sample groups...');
        const groupsResult = await client.query(`
            INSERT INTO groups (name, description, group_type, leader_id, meeting_schedule, is_active)
            VALUES 
                ('Youth Ministry', 'Ministry for young people aged 18-35', 'ministry', $1, 'Every Saturday 4:00 PM', true),
                ('Worship Team', 'Church worship and praise team', 'ministry', $1, 'Sunday mornings and Wednesday rehearsal', true),
                ('Men''s Fellowship', 'Fellowship for men of all ages', 'fellowship', $1, 'First Saturday of the month', true),
                ('Women''s Fellowship', 'Fellowship for women of all ages', 'fellowship', null, 'Second Saturday of the month', true)
            RETURNING id, name
        `, [members[2].id]); // David Ochieng as leader

        const groups = groupsResult.rows;
        logger.info(`✅ Created ${groups.length} groups`);

        // =====================================================
        // 7. ADD MEMBERS TO GROUPS
        // =====================================================
        logger.info('Adding members to groups...');
        await client.query(`
            INSERT INTO group_members (group_id, member_id, role, joined_date)
            VALUES 
                ($1, $2, 'leader', CURRENT_DATE),
                ($1, $3, 'member', CURRENT_DATE),
                ($4, $5, 'member', CURRENT_DATE),
                ($4, $6, 'member', CURRENT_DATE),
                ($7, $2, 'member', CURRENT_DATE),
                ($8, $3, 'member', CURRENT_DATE),
                ($8, $5, 'member', CURRENT_DATE)
        `, [
            groups[0].id, members[2].id, members[0].id,
            groups[1].id, members[1].id, members[3].id,
            groups[2].id,
            groups[3].id
        ]);
        logger.info('✅ Added members to groups');

        // =====================================================
        // 8. CREATE SAMPLE SERVICES
        // =====================================================
        logger.info('Creating sample services...');
        const servicesResult = await client.query(`
            INSERT INTO services (service_name, service_type, service_date, service_time, attendance_count)
            VALUES 
                ('Sunday Service', 'sunday_service', CURRENT_DATE - INTERVAL '7 days', '09:00', 120),
                ('Sunday Service', 'sunday_service', CURRENT_DATE, '09:00', 0),
                ('Midweek Service', 'midweek_service', CURRENT_DATE - INTERVAL '3 days', '18:00', 45),
                ('Prayer Meeting', 'prayer_meeting', CURRENT_DATE - INTERVAL '1 day', '06:00', 30)
            RETURNING id, service_name, service_date
        `);

        const services = servicesResult.rows;
        logger.info(`✅ Created ${services.length} services`);

        // =====================================================
        // 9. CREATE ATTENDANCE RECORDS
        // =====================================================
        logger.info('Creating attendance records...');
        const attendanceValues = [];
        for (let i = 0; i < members.length; i++) {
            attendanceValues.push(`('${services[0].id}', '${members[i].id}', 'present', NOW())`);
        }

        await client.query(`
            INSERT INTO attendance_records (service_id, member_id, attendance_status, check_in_time)
            VALUES ${attendanceValues.join(', ')}
        `);
        logger.info(`✅ Created attendance records for ${members.length} members`);

        // =====================================================
        // 10. CREATE SAMPLE CONTRIBUTIONS
        // =====================================================
        logger.info('Creating sample contributions...');
        await client.query(`
            INSERT INTO contributions (
                member_id, fund_id, amount, contribution_type, 
                payment_method, contribution_date, recorded_by
            )
            VALUES 
                ($1, $2, 5000.00, 'tithe', 'mobile_money', CURRENT_DATE - INTERVAL '7 days', $3),
                ($4, $2, 3000.00, 'tithe', 'cash', CURRENT_DATE - INTERVAL '7 days', $3),
                ($5, $2, 7000.00, 'tithe', 'bank_transfer', CURRENT_DATE - INTERVAL '7 days', $3),
                ($1, $6, 2000.00, 'offering', 'mobile_money', CURRENT_DATE - INTERVAL '7 days', $3),
                ($4, $7, 10000.00, 'donation', 'bank_transfer', CURRENT_DATE - INTERVAL '14 days', $3),
                ($5, $8, 5000.00, 'donation', 'mobile_money', CURRENT_DATE - INTERVAL '14 days', $3)
        `, [
            members[0].id, funds[0].id, adminUserId,
            members[2].id,
            members[4].id,
            funds[1].id,
            funds[2].id,
            funds[3].id
        ]);
        logger.info('✅ Created sample contributions');

        // =====================================================
        // 11. CREATE SAMPLE PLEDGES
        // =====================================================
        logger.info('Creating sample pledges...');
        await client.query(`
            INSERT INTO pledges (
                member_id, fund_id, pledge_amount, amount_paid, 
                pledge_date, due_date, status
            )
            VALUES 
                ($1, $2, 50000.00, 10000.00, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days', 'active'),
                ($3, $2, 100000.00, 25000.00, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days', 'active')
        `, [members[0].id, funds[1].id, members[2].id]);
        logger.info('✅ Created sample pledges');

        // =====================================================
        // 12. CREATE SAMPLE EVENT
        // =====================================================
        logger.info('Creating sample event...');
        const eventResult = await client.query(`
            INSERT INTO events (
                event_name, description, event_type, start_date, end_date, 
                location, max_participants, cost, is_public, created_by
            )
            VALUES 
                ('Annual Church Retreat', 'Three-day spiritual retreat at the coast', 'retreat', 
                 CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '33 days', 
                 'Mombasa Beach Resort', 100, 15000.00, true, $1)
            RETURNING id, event_name
        `, [adminUserId]);

        const event = eventResult.rows[0];
        logger.info(`✅ Created event: ${event.event_name}`);

        // =====================================================
        // 13. CREATE EVENT REGISTRATIONS
        // =====================================================
        logger.info('Creating event registrations...');
        await client.query(`
            INSERT INTO event_registrations (event_id, member_id, payment_status, amount_paid)
            VALUES 
                ($1, $2, 'paid', 15000.00),
                ($1, $3, 'pending', 0),
                ($1, $4, 'paid', 15000.00)
        `, [event.id, members[0].id, members[1].id, members[2].id]);
        logger.info('✅ Created event registrations');

        // =====================================================
        // 14. CREATE SAMPLE ANNOUNCEMENT
        // =====================================================
        logger.info('Creating sample announcement...');
        await client.query(`
            INSERT INTO announcements (
                title, content, announcement_type, target_audience, 
                start_date, end_date, is_active, created_by
            )
            VALUES 
                ('Welcome New Members', 
                 'We are excited to welcome our new members who joined us this month. Please introduce yourself after the service!', 
                 'general', 'all', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', true, $1),
                ('Youth Ministry Meeting', 
                 'All youth are invited to our monthly meeting this Saturday at 4 PM. Refreshments will be served!', 
                 'event', 'all', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', true, $1)
        `, [adminUserId]);
        logger.info('✅ Created sample announcements');

        // =====================================================
        // COMMIT TRANSACTION
        // =====================================================
        await client.query('COMMIT');
        logger.info('✅ Database seeding completed successfully!');
        logger.info('');
        logger.info('========================================');
        logger.info('DEFAULT LOGIN CREDENTIALS');
        logger.info('========================================');
        logger.info('System Admin:');
        logger.info('  Email: admin@spokenword.com');
        logger.info('  Password: Admin123!');
        logger.info('');
        logger.info('Sample Member (Leader):');
        logger.info('  Email: david.ochieng@example.com');
        logger.info('  Password: Member123!');
        logger.info('');
        logger.info('Sample Member (Finance):');
        logger.info('  Email: peter.kamau@example.com');
        logger.info('  Password: Member123!');
        logger.info('');
        logger.info('Sample Member (Regular):');
        logger.info('  Email: john.mwangi@example.com');
        logger.info('  Password: Member123!');
        logger.info('========================================');

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        client.release();
        await db.pool.end();
    }
}

// Run seeding if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            logger.info('Seeding process completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Seeding process failed:', error);
            process.exit(1);
        });
}

module.exports = seedDatabase;
