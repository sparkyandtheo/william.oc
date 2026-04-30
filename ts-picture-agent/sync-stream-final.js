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

        const request = new sql.Request(pool);
        request.stream = true;
        
        const countResult = await pool.request().query('SELECT COUNT(*) as total FROM TicketPic WHERE PicData IS NOT NULL AND LEN(PicData) > 100');
        const total = countResult.recordset[0].total;
        console.log(`Found ${total} pictures. Starting stream...`);

        const tempDir = './temp_pics';
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        let processed = 0;
        request.query('SELECT TicketID, PictureName, PicData, TicketPicID FROM TicketPic WHERE PicData IS NOT NULL AND LEN(PicData) > 100');

        request.on('row', row => {
            processed++;
            const ticketId = row.TicketID || 'unknown';
            const picName = (row.PictureName || 'photo').replace(/[^a-z0-9]/gi, '_');
            const picId = row.TicketPicID;
            const fileName = `${ticketId}_${picId}_${picName}.jpg`;
            const localPath = path.join(tempDir, fileName);

            // Path on the SMB share
            const remotePath = `TicketPics/${fileName}`;

            try {
                // Convert Base64 to Buffer
                const buffer = Buffer.from(row.PicData, 'base64');
                fs.writeFileSync(localPath, buffer);

                // Command to put file in the TicketPics directory of the SHARED share
                const cmd = `smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "put ${localPath} TicketPics/${fileName}"`;
                execSync(cmd, { stdio: 'ignore' });
                
                if (processed % 10 === 0) {
                    console.log(`Processed ${processed}/${total}...`);
                }
            } catch (err) {
                console.error(`\nFailed to upload ${fileName} to ${remotePath}:`, err.message);
            } finally {
                if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
            }
        });

        request.on('error', err => {
            console.error('Stream Error:', err.message);
        });

        request.on('done', () => {
            console.log('\nStream finished. All rows processed.');
            pool.close();
        });

    } catch (err) {
        console.error('Error:', err.message);
        if (pool) pool.close();
    }
}

syncToNetwork();
