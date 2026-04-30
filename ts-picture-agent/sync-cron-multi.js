const sql = require('mssql');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const dbCreds = {
    user: 'ts',
    password: '@HODd00r5',
    server: '192.168.1.15',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

const SMB_BASE = '//192.168.1.15/SHARED';
const SMB_USER = 'HOD/william';
const SMB_PASS = 'Theangrouseiscoming19@';

const DATABASES = ['HOD', 'WNY', 'OHD'];

async function syncAllDatabases() {
    console.log(`[${new Date().toISOString()}] Starting multi-DB sync...`);
    
    const tempDir = path.join(__dirname, 'temp_pics');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    for (const dbName of DATABASES) {
        let pool;
        try {
            console.log(`Syncing database: ${dbName}`);
            pool = await sql.connect({ ...dbCreds, database: dbName });

            const result = await pool.request().query(`
                SELECT TicketID, PictureName, PicData, TicketPicID, ModifiedOn
                FROM TicketPic 
                WHERE PicData IS NOT NULL 
                AND LEN(PicData) > 100
                AND ModifiedOn >= DATEADD(day, -30, GETDATE())
                ORDER BY ModifiedOn DESC
            `);

            const total = result.recordset.length;
            console.log(`- Found ${total} recent pictures in ${dbName}.`);

            const createdFolders = new Set();

            for (let i = 0; i < total; i++) {
                const row = result.recordset[i];
                const ticketId = row.TicketID || 'unknown';
                const picName = (row.PictureName || 'photo').replace(/[^a-z0-9]/gi, '_');
                const picId = row.TicketPicID;
                const fileName = `${ticketId}_${picId}_${picName}.jpg`;
                const localPath = path.join(tempDir, fileName);
                
                // Path: TicketPics/<DBName>/<TicketID>/<FileName>.jpg
                const dbFolder = `TicketPics/${dbName}`;
                const ticketFolder = `${dbFolder}/${ticketId}`;
                const remotePath = `${ticketFolder}/${fileName}`;

                try {
                    fs.writeFileSync(localPath, Buffer.from(row.PicData, 'base64'));

                    // Ensure DB folder and Ticket folder exist
                    if (!createdFolders.has(ticketFolder)) {
                        try { execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "mkdir \\"${dbFolder}\\""`, { stdio: 'ignore' }); } catch (e) {}
                        try { execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "mkdir \\"${ticketFolder}\\""`, { stdio: 'ignore' }); } catch (e) {}
                        createdFolders.add(ticketFolder);
                    }

                    execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "put \\"${localPath}\\" \\"${remotePath}\\""`, { stdio: 'ignore' });
                } catch (err) {
                    // Skip errors
                } finally {
                    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
                }
            }
            console.log(`- Finished ${dbName}.`);
        } catch (err) {
            console.error(`Error syncing ${dbName}:`, err.message);
        } finally {
            if (pool) await pool.close();
        }
    }
    console.log(`[${new Date().toISOString()}] Multi-DB sync complete.`);
}

syncAllDatabases();
