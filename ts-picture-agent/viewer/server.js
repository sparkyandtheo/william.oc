const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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
        console.error('Error fetching tickets:', err.message);
        res.status(500).send(err.message);
    }
});

app.get('/api/:db/photos/:ticketId', async (req, res) => {
    try {
        const pool = await getPool(req.params.db);
        const result = await pool.request()
            .input('ticketId', sql.Int, req.params.ticketId)
            .query(`
                SELECT TicketPicID, PictureName, PicData, TicketID
                FROM dbo.TicketPic
                WHERE TicketID = @ticketId
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching photos:', err.message);
        res.status(500).send(err.message);
    }
});

// Archive Dashboard log reader
const GMAIL_MEMORY = path.join(__dirname, '..', '..', 'gmail-agent', 'memory');

app.get('/api/archive-log/:date', async (req, res) => {
    try {
        const logPath = path.join(GMAIL_MEMORY, req.params.date + '-cron-log.md');
        if (!fs.existsSync(logPath)) {
            return res.json({ cycles: [], error: 'No log for this date' });
        }
        const content = fs.readFileSync(logPath, 'utf8');
        const cycles = [];
        let currentCycle = null;
        content.split('\n').forEach(line => {
            if (line.startsWith('## Gmail Sync')) {
                if (currentCycle) cycles.push(currentCycle);
                currentCycle = { time: line.replace('## Gmail Sync (', '').replace(')', ''), lines: [] };
            } else if (currentCycle) {
                currentCycle.lines.push(line);
            }
        });
        if (currentCycle) cycles.push(currentCycle);
        res.json({ date: req.params.date, cycles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Status dashboard — parses latest cycle for glanceable overview

app.get('/api/status-today', async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const logPath = path.join(GMAIL_MEMORY, today + '-cron-log.md');
        const status = {
            date: today, lastUpdated: null, cycles: 0,
            rules: {
                attendance: { match: false, detail: '' },
                estimator: { match: false, detail: '' },
                schedule: { match: false, detail: '' },
                serviceRequests: { match: false, detail: '' },
                beforeAfter: { match: false, detail: '' },
                greensky: { match: false, detail: '' },
                jenAlert: { match: false, detail: '' },
            },
            alerts: [], actionItems: [], inboxEmpty: true
        };

        if (!fs.existsSync(logPath)) {
            return res.json({ ...status, note: 'No log yet today' });
        }

        const raw = fs.readFileSync(logPath, 'utf8');
        const allLines = raw.split('\n');
        status.cycles = (raw.match(/^## Gmail Sync /gm) || []).length;

        // Find the last cycle header and collect its lines
        let lastHdrIdx = -1;
        for (let i = allLines.length - 1; i >= 0; i--) {
            if (/^## Gmail Sync /.test(allLines[i])) {
                lastHdrIdx = i;
                break;
            }
        }

        if (lastHdrIdx === -1) return res.json({ ...status, note: 'No cycles found' });

        // Extract time and collect lines of the last cycle
        const timeMatch = allLines[lastHdrIdx].match(/^## Gmail Sync \(([^)]+)\)/);
        status.lastUpdated = timeMatch ? timeMatch[1] : '';

        // Collect lines between this header and the next one (or file end)
        const cycleLines = [];
        for (let i = lastHdrIdx + 1; i < allLines.length; i++) {
            if (/^## Gmail Sync /.test(allLines[i])) break;
            cycleLines.push(allLines[i]);
        }

        // Parse rule results from cycle lines
        for (const line of cycleLines) {
            // Strip leading whitespace and emoji
            const clean = line.replace(/^[\s]+/, '').replace(/[\u2705\u274c\u{1f7e1}\u{1f7e2}]/gu, '').trim();

            if (/^- \*\*Staff (?:attendance|availability)\*\*/.test(clean)) {
                const matched = /\*\*Matched\*\*/.test(clean);
                status.rules.attendance = { match: matched, detail: matched ? clean.replace(/^- .*?\*\*Matched\*\*/, '').trim() || 'Staff update' : 'No activity' };
                if (matched) status.inboxEmpty = false;
            } else if (/^- \*\*Web estimator\*\*/.test(clean)) {
                const matched = /\*\*Matched\*\*/.test(clean);
                status.rules.estimator = { match: matched, detail: matched ? clean.replace(/^- .*?\*\*Matched\*\*/, '').trim() || 'Lead received' : 'No new leads' };
                if (matched) status.inboxEmpty = false;
            } else if (/^- \*\*Service schedule\*\*/.test(clean)) {
                const matched = /\*\*Matched\*\*/.test(clean);
                status.rules.schedule = { match: matched, detail: matched ? clean.replace(/^- .*?\*\*Matched\*\*/, '').trim() || 'Schedule update' : 'No activity' };
                if (matched) status.inboxEmpty = false;
            } else if (/^- \*\*Service Requests\*\*/.test(clean)) {
                const matched = /\*\*Matched\*\*/.test(clean);
                status.rules.serviceRequests = { match: matched, detail: matched ? clean.replace(/^- .*?\*\*Matched\*\*/, '').trim() || 'Request received' : 'No activity' };
                if (matched) status.inboxEmpty = false;
            } else if (/^- \*\*Before & After\*\*/.test(clean)) {
                const matched = /\*\*Matched\*\*/.test(clean);
                status.rules.beforeAfter = { match: matched, detail: matched ? clean.replace(/^- .*?\*\*Matched\*\*/, '').trim() || 'Photos received' : 'No activity' };
                if (matched) status.inboxEmpty = false;
            } else if (/^- \*\*Greensky\*\*/.test(clean)) {
                const matched = /\*\*Matched\*\*/.test(clean);
                status.rules.greensky = { match: matched, detail: matched ? clean.replace(/^- .*?\*\*Matched\*\*/, '').trim() || 'Activity' : 'No activity' };
                if (matched) status.inboxEmpty = false;
            } else if (/^- \*\*Jen Telegram Alert\*\*/.test(clean)) {
                const notTrig = clean.includes('Not triggered');
                status.rules.jenAlert = { match: !notTrig, detail: notTrig ? 'No unmatched Jen emails' : 'Alert sent' };
                if (!notTrig) status.inboxEmpty = false;
            }

            // Result line
            if (/\*\*Result\*\*/.test(clean)) {
                const result = clean.replace(/^.*?\*\*Result\*\*[\s:-]*/, '').trim();
                if (/Alert|Processed|Needs/i.test(result)) {
                    if (/Alert|🔴/i.test(result)) status.alerts.push(result);
                    else status.actionItems.push(result);
                }
            }
        }

        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(port, '0.0.0.0', () => {
    console.log('Viewer API running at http://0.0.0.0:' + port);
});
