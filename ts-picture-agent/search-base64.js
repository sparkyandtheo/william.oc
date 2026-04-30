const sql = require('mssql');

const config = {
    user: 'ts',
    password: '@HODd00r5',
    server: '192.168.1.15',
    database: 'HOD',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

async function findBase64Strings() {
    try {
        let pool = await sql.connect(config);
        console.log('Connected. Searching for Base64-like strings...');

        // Querying common text columns for Base64 markers (data:image/jpeg;base64 or just long strings)
        // We'll start with the 'Photo' table as it was identified earlier
        let result = await pool.request().query(`
            SELECT TOP 5 * 
            FROM Photo
        `);

        console.log('Sample from Photo table:');
        console.dir(result.recordset);

        // Also search for columns that might contain text/strings instead of binary
        let columns = await pool.request().query(`
            SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE DATA_TYPE IN ('varchar', 'nvarchar', 'text', 'ntext')
            AND (COLUMN_NAME LIKE '%Photo%' OR COLUMN_NAME LIKE '%Image%' OR COLUMN_NAME LIKE '%Data%')
        `);

        console.log('Potential text columns for Base64 data:');
        console.table(columns.recordset);

        await pool.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

findBase64Strings();
