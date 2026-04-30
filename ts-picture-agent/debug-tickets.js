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

async function debugTickets() {
    for (const dbName of DATABASES) {
        let pool;
        try {
            console.log(`Checking ${dbName}...`);
            pool = await sql.connect({ ...dbCreds, database: dbName });
            
            // Check top 5 from TicketPic to see columns and date
            const sample = await pool.request().query('SELECT TOP 5 TicketID, ModifiedOn FROM TicketPic ORDER BY ModifiedOn DESC');
            console.log(`Sample data from ${dbName}:`);
            console.table(sample.recordset);

            const result = await pool.request().query(`
                SELECT DISTINCT TOP 20 TicketID 
                FROM TicketPic 
                WHERE ModifiedOn >= DATEADD(day, -30, GETDATE())
                ORDER BY TicketID DESC
            `);
            console.log(`Query for last 30 days in ${dbName} returned ${result.recordset.length} rows.`);

        } catch (err) {
            console.error(`Error in ${dbName}:`, err.message);
        } finally {
            if (pool) await pool.close();
        }
    }
}

debugTickets();
