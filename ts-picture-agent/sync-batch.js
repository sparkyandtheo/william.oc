const sql = require('mssql');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

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

const SMB_BASE = '//192.168.1.15/SHARED';
const SMB_USER = 'HOD/william';
const SMB_PASS = 'Theangrouseiscoming19@';

async function syncToNetwork() {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        console.log('Connected to HOD database.');

        const tempDir = './temp_pics';
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        // Fetch everything but handle rows manually to avoid heap issues
        const result = await pool.request().query('SELECT TicketID, PictureName, PicData, TicketPicID FROM TicketPic WHERE PicData IS NOT NULL AND LEN(PicData) > 100');
        const total = result.recordset.length;
        console.log(`Found ${total} pictures. Processing...`);

        for (let i = 0; i < total; i++) {
            const row = result.recordset[i];
            const ticketId = row.TicketID || 'unknown';
            const picName = (row.PictureName || 'photo').replace(/[^a-z0-9]/gi, '_');
            const picId = row.TicketPicID;
            const fileName = `${ticketId}_${picId}_${picName}.jpg`;
            const localPath = path.join(tempDir, fileName);

            try {
                fs.writeFileSync(localPath, Buffer.from(row.PicData, 'base64'));

                const cmd = `smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "put ${localPath} TicketPics/${fileName}"`;
                execSync(cmd, { stdio: 'ignore' });
                
                if ((i + 1) % 10 === 0) {
                    console.log(`Processed ${i + 1}/${total}...`);
                }
            } catch (err) {
                console.error(`\nFailed to upload ${fileName}:`, err.message);
            } finally {
                if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
            }
        }

        pool.close();
        console.log('\nSync complete.');
    } catch (err) {
        console.error('Error:', err.message);
        if (pool) pool.close();
    }
}

syncToNetwork();
