const db = require('./src/config/database');

async function inspectData() {
    try {
        console.log("--- MEMBERS (ID only) ---");
        const members = await db.query('SELECT id FROM members LIMIT 5');
        console.log("Rows found:", members.rows.length);
        console.table(members.rows);

        console.log("--- MEMBERS (More cols) ---");
        // Try guessing columns based on service file: first_name, last_name, email
        const membersFull = await db.query('SELECT id, first_name, last_name, email FROM members LIMIT 5');
        console.table(membersFull.rows);

    } catch (err) {
        console.error("Error inspecting data:", err);
    } finally {
        process.exit();
    }
}

inspectData();
