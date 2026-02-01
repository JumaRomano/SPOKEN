require('dotenv').config();
const db = require('./src/config/database');

async function inspectPermissions() {
    try {
        console.log("--- ATTENDANCE PERMISSIONS ---");
        const result = await db.query("SELECT role, resource, action, is_allowed FROM permissions WHERE resource = 'attendance' OR resource = '*'");
        console.table(result.rows);
    } catch (err) {
        console.error("Error inspecting permissions:", err);
    } finally {
        process.exit();
    }
}

inspectPermissions();
