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

async function syncRefined() {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        console.log(`[${new Date().toISOString()}] Connected to HOD database.`);

        const tempDir = path.join(__dirname, 'temp_pics');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const result = await pool.request().query(`
            SELECT TicketID, PictureName, PicData, TicketPicID, ModifiedOn
            FROM TicketPic 
            WHERE PicData IS NOT NULL 
            AND LEN(PicData) > 100
            AND ModifiedOn >= DATEADD(day, -30, GETDATE())
            ORDER BY ModifiedOn DESC
        `);

        const total = result.recordset.length;
        console.log(`Processing ${total} recent pictures...`);

        const createdFolders = new Set();

        for (let i = 0; i < total; i++) {
            const row = result.recordset[i];
            const ticketId = row.TicketID || 'unknown';
            const picName = (row.PictureName || 'photo').replace(/[^a-z0-9]/gi, '_');
            const picId = row.TicketPicID;
            const fileName = `${ticketId}_${picId}_${picName}.jpg`;
            const localPath = path.join(tempDir, fileName);
            const remoteFolder = `TicketPics/${ticketId}`;
            const remotePath = `${remoteFolder}/${fileName}`;

            try {
                fs.writeFileSync(localPath, Buffer.from(row.PicData, 'base64'));

                if (!createdFolders.has(ticketId)) {
                    try {
                        execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "mkdir \\"${remoteFolder}\\""`, { stdio: 'ignore' });
                    } catch (e) {}
                    createdFolders.add(ticketId);
                }

                execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "put \\"${localPath}\\" \\"${remotePath}\\""`, { stdio: 'ignore' });
            } catch (err) {
                // Silently skip if file exists or network blip
            } finally {
                if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
            }
        }

        pool.close();
        console.log(`[${new Date().toISOString()}] Sync complete.`);
    } catch (err) {
        console.error('Error:', err.message);
        if (pool) pool.close();
    }
}

syncRefined();
