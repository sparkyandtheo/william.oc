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

const SMB_PATH = '//192.168.1.15/SHARED/TicketPics';
const SMB_USER = 'HOD/william';
const SMB_PASS = 'Theangrouseiscoming19@';

async function syncToNetwork() {
    try {
        let pool = await sql.connect(dbConfig);
        console.log('Connected to HOD database.');

        // Get pictures from TicketPic
        let result = await pool.request().query(`
            SELECT TicketID, PictureName, PicData, TicketPicID
            FROM TicketPic 
            WHERE PicData IS NOT NULL AND LEN(PicData) > 100
        `);

        console.log(`Found ${result.recordset.length} pictures.`);

        const tempDir = './temp_pics';
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        for (const row of result.recordset) {
            const ticketId = row.TicketID || 'unknown';
            const picName = (row.PictureName || 'photo').replace(/[^a-z0-9]/gi, '_');
            const picId = row.TicketPicID;
            const fileName = `${ticketId}_${picId}_${picName}.jpg`;
            const localPath = path.join(tempDir, fileName);

            // Write local temp file
            fs.writeFileSync(localPath, Buffer.from(row.PicData, 'base64'));

            // Upload via smbclient
            try {
                const cmd = `smbclient "${SMB_PATH}" -U "${SMB_USER}%${SMB_PASS}" -c "put ${localPath} ${fileName}"`;
                execSync(cmd, { stdio: 'ignore' });
                process.stdout.write('.'); // progress dot
            } catch (err) {
                console.error(`\nFailed to upload ${fileName}:`, err.message);
            }

            // Clean up local temp
            fs.unlinkSync(localPath);
        }

        await pool.close();
        console.log('\nSync complete.');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

syncToNetwork();
