require('dotenv').config();
const communicationService = require('./src/services/communicationService');
const db = require('./src/config/database');

async function testBroadcast() {
    try {
        console.log('Testing broadcast...');

        // 1. Get a published announcement or create a dummy one
        const res = await db.query('SELECT id FROM announcements WHERE is_active = $1 LIMIT 1', [true]);

        if (res.rows.length === 0) {
            console.log('No published announcements found. Please create one first.');
            process.exit(0);
        }

        const announcementId = res.rows[0].id;
        console.log(`Using announcement ID: ${announcementId}`);

        // 2. Perform broadcast
        const result = await communicationService.sendBroadcast(announcementId, ['email', 'sms']);

        console.log('Broadcast finished with results:', JSON.stringify(result, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Broadcast test failed:', error);
        if (error.detail) console.log('Detail:', error.detail);
        if (error.hint) console.log('Hint:', error.hint);
        if (error.where) console.log('Where:', error.where);
        process.exit(1);
    }
}

testBroadcast();
