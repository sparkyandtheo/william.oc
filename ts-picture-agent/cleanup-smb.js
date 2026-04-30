const { execSync } = require('child_process');

const SMB_BASE = '//192.168.1.15/SHARED';
const SMB_USER = 'HOD/william';
const SMB_PASS = 'Theangrouseiscoming19@';
const TARGET_DIR = 'TicketPics';

const THIRTY_DAYS_AGO = new Date();
THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

function cleanUp() {
    console.log(`Cleaning up items older than ${THIRTY_DAYS_AGO.toISOString()}...`);
    
    try {
        const output = execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "cd ${TARGET_DIR}; ls"`, { encoding: 'utf8' });
        const lines = output.split('\n');
        
        for (const line of lines) {
            // smbclient ls format: "  Name                                  D        0  Day Month Date Time Year"
            // Example: "  Ticket_416102                       D        0  Thu Apr 16 15:49:25 2026"
            const match = line.match(/^\s+(.*?)\s+([DAHS]+)\s+\d+\s+(.*)$/);
            if (!match) continue;

            const name = match[1].trim();
            const attr = match[2];
            const dateStr = match[3];

            if (name === '.' || name === '..') continue;

            const itemDate = new Date(dateStr);
            if (isNaN(itemDate.getTime())) continue;

            if (itemDate < THIRTY_DAYS_AGO) {
                console.log(`Deleting OLD item: ${name} (${dateStr})`);
                if (attr.includes('D')) {
                    // Recursive delete for directory is hard with smbclient without 'deltree' (not always present)
                    // We'll try 'rm -r' style or just remove files inside if possible.
                    // For now, let's try the simple 'rmdir'.
                    try {
                        execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "cd ${TARGET_DIR}; deltree \\"${name}\\""`, { stdio: 'ignore' });
                    } catch (e) {
                        console.error(`Failed to delete folder ${name}:`, e.message);
                    }
                } else {
                    try {
                        execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "cd ${TARGET_DIR}; del \\"${name}\\""`, { stdio: 'ignore' });
                    } catch (e) {
                        console.error(`Failed to delete file ${name}:`, e.message);
                    }
                }
            } else if (!attr.includes('D') && name.endsWith('.jpg')) {
                // Also clean up the "flat" .jpg files I created today in the root
                console.log(`Deleting flat file (migrated to folder): ${name}`);
                try {
                    execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "cd ${TARGET_DIR}; del \\"${name}\\""`, { stdio: 'ignore' });
                } catch (e) {
                    console.error(`Failed to delete file ${name}:`, e.message);
                }
            }
        }
    } catch (err) {
        console.error('Error during cleanup:', err.message);
    }
}

cleanUp();
