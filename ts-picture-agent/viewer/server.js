const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const baseConfig = {
    user: 'ts',
    password: '@HODd00r5',
    server: '192.168.1.15',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

// Map to store connection pools
const pools = new Map();

async function getPool(dbName) {
    if (pools.has(dbName)) return pools.get(dbName);
    
    const config = { ...baseConfig, database: dbName };
    const pool = new sql.ConnectionPool(config);
    const connectedPool = await pool.connect();
    pools.set(dbName, connectedPool);
    return connectedPool;
}

app.get('/api/databases', async (req, res) => {
    try {
        const pool = await getPool('master');
        const result = await pool.request().query(`
            SELECT name FROM sys.databases WHERE name IN ('HOD', 'WNY', 'OHD')
        `);
        res.json(result.recordset.map(r => r.name));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/api/:db/tickets', async (req, res) => {
    try {
        const pool = await getPool(req.params.db);
        const result = await pool.request().query(`
            SELECT DISTINCT TicketID 
            FROM dbo.TicketPic 
            WHERE ModifiedOn >= DATEADD(day, -30, GETDATE())
            ORDER BY TicketID DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error(`Error fetching tickets for ${req.params.db}:`, err.message);
        res.status(500).send(err.message);
    }
});

app.get('/api/:db/photos/:ticketId', async (req, res) => {
    try {
        const pool = await getPool(req.params.db);
        const result = await pool.request()
            .input('ticketId', sql.Int, req.params.ticketId)
            .query(`
                SELECT 
                    TicketPicID, 
                    PictureName, 
                    PicData,
                    TicketID
                FROM dbo.TicketPic
                WHERE TicketID = @ticketId
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error(`Error fetching photos for ${req.params.db} ticket ${req.params.ticketId}:`, err.message);
        res.status(500).send(err.message);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Viewer API running at http://0.0.0.0:${port}`);
});
