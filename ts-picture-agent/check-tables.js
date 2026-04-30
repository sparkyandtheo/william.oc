const sql = require('mssql');

const dbCreds = {
    user: 'ts',
    password: '@HODd00r5',
    server: '192.168.1.15',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

const DATABASES = ['HOD', 'WNY', 'OHD'];

async function checkTables() {
    for (const dbName of DATABASES) {
        let pool;
        try {
            console.log(`Checking tables in ${dbName}...`);
            pool = await sql.connect({ ...dbCreds, database: dbName });
            
            const result = await pool.request().query(`
                SELECT TABLE_SCHEMA, TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME LIKE '%TicketPic%'
            `);
            console.log(`Results for ${dbName}:`);
            console.table(result.recordset);

        } catch (err) {
            console.error(`Error in ${dbName}:`, err.message);
        } finally {
            if (pool) await pool.close();
        }
    }
}

checkTables();
