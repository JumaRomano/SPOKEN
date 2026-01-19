const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../src/config/database');

const createSermonsTable = async () => {
    try {
        console.log('Creating sermons table...');

        await db.query(`
            CREATE TABLE IF NOT EXISTS sermons (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                video_url TEXT NOT NULL,
                speaker VARCHAR(255),
                series VARCHAR(255),
                description TEXT,
                date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Sermons table created successfully.');

        // Check if table is empty
        const countResult = await db.query('SELECT COUNT(*) FROM sermons');
        const count = parseInt(countResult.rows[0].count);

        if (count === 0) {
            console.log('Seeding initial sermon data...');
            await db.query(`
                INSERT INTO sermons (title, video_url, speaker, series, description, date)
                VALUES 
                ('Walking in Faith', 'https://www.tiktok.com/@spokenword/video/1234567890', 'Pastor John Doe', 'The Book of James', 'A powerful message on faith in action.', '2025-10-15'),
                ('Power of Prayer', 'https://www.tiktok.com/@spokenword/video/0987654321', 'Pastor Jane Doe', 'Spiritual Disciplines', 'Understanding how prayer changes things.', '2025-10-08')
            `);
            console.log('Initial data seeded.');
        } else {
            console.log('Sermons table already has data.');
        }

    } catch (error) {
        console.error('Error creating sermons table:', error);
    } finally {
        process.exit();
    }
};

createSermonsTable();
