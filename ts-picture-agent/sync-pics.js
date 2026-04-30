const sql = require('mssql');
const fs = require('fs');
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

const DEST_DIR = '/home/william/ticketpics_drive';

async function processPictures() {
    try {
        let pool = await sql.connect(dbConfig);
        console.log('Connected to database. Fetching pictures...');

        // Fetching top 10 for a test run
        let result = await pool.request().query(`
            SELECT TOP 10 TicketID, PictureName, PicData, TicketPicID
            FROM TicketPic 
            WHERE PicData IS NOT NULL AND LEN(PicData) > 100
        `);

        console.log(`Found ${result.recordset.length} pictures to process.`);

        for (const row of result.recordset) {
            try {
                const ticketId = row.TicketID || 'unknown';
                const picName = (row.PictureName || 'photo').replace(/[^a-z0-9]/gi, '_');
                const picId = row.TicketPicID;
                const fileName = `${ticketId}_${picId}_${picName}.jpg`;
                const filePath = path.join(DEST_DIR, fileName);

                // Decode base64
                const buffer = Buffer.from(row.PicData, 'base64');
                
                // Save to file
                fs.writeFileSync(filePath, buffer);
                console.log(`Saved: ${fileName}`);
            } catch (err) {
                console.error(`Failed to save record ${row.TicketPicID}:`, err.message);
            }
        }

        await pool.close();
        console.log('Finished processing test batch.');
    } catch (err) {
        console.error('Database Error:', err.message);
    }
}

// Ensure local dir exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

processPictures();
