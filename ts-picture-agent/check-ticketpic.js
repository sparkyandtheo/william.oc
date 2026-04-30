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

async function checkTicketPic() {
    try {
        let pool = await sql.connect(config);
        console.log('Checking TicketPic table for Base64 data...');

        let result = await pool.request().query(`
            SELECT TOP 1 * 
            FROM TicketPic 
            WHERE PicData IS NOT NULL AND LEN(PicData) > 100
        `);

        if (result.recordset.length > 0) {
            const row = result.recordset[0];
            console.log('Sample found in TicketPic:');
            console.log('Columns:', Object.keys(row));
            console.log('PicData start:', row.PicData.substring(0, 100));
            console.log('PicData length:', row.PicData.length);
        } else {
            console.log('No data found in TicketPic with PicData > 100 chars.');
        }

        await pool.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkTicketPic();
