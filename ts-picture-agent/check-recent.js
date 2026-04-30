const sql = require('mssql');

const dbConfig = {
    user: 'ts',
    password: '@HODd00r5',
    server: '192.168.1.15',
    database: 'HOD',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

async function checkRecentCount() {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`
            SELECT COUNT(*) as recentCount 
            FROM TicketPic 
            WHERE PicData IS NOT NULL 
            AND LEN(PicData) > 100
            AND ModifiedOn >= DATEADD(day, -30, GETDATE())
        `);
        console.log(`Recent pictures (last 30 days): ${result.recordset[0].recentCount}`);
        await pool.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkRecentCount();
