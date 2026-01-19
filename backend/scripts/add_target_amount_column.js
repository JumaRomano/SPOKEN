require('dotenv').config();
const db = require('../src/config/database');

/**
 * Add target_amount column to funds table
 */
async function addTargetAmountColumn() {
    try {
        console.log('🔄 Adding target_amount column to funds table...\n');

        await db.query(`
            ALTER TABLE funds 
            ADD COLUMN IF NOT EXISTS target_amount DECIMAL(12, 2) DEFAULT NULL
        `);

        console.log('✅ Column added successfully!\n');

        // Verify the column was added
        const result = await db.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'funds' 
            ORDER BY ordinal_position
        `);

        console.log('Current funds table structure:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name.padEnd(20)} | ${row.data_type.padEnd(20)} | Nullable: ${row.is_nullable}`);
        });

        console.log('\n✅ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Failed to add column:', error.message);
        console.error(error);
        throw error;
    } finally {
        await db.pool.end();
    }
}

// Run
addTargetAmountColumn()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
