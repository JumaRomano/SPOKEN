const db = require('./src/config/database');

async function inspectSchema() {
    try {
        console.log("--- ALL TABLES ---");
        const res = await db.query("SELECT schemaname, tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'");
        console.table(res.rows);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

inspectSchema();
