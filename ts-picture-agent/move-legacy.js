const { execSync } = require('child_process');

const SMB_BASE = '//192.168.1.15/SHARED';
const SMB_USER = 'HOD/william';
const SMB_PASS = 'Theangrouseiscoming19@';
const TARGET_DIR = 'TicketPics';

const DATABASES = ['HOD', 'WNY', 'OHD'];

function moveLegacyFolders() {
    console.log(`Moving legacy ticket folders into the HOD subfolder...`);
    
    try {
        const output = execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "cd ${TARGET_DIR}; ls"`, { encoding: 'utf8' });
        const lines = output.split('\n');
        
        for (const line of lines) {
            const match = line.match(/^\s+(.*?)\s+([DAHS]+)\s+\d+\s+(.*)$/);
            if (!match) continue;

            const name = match[1].trim();
            const attr = match[2];

            if (name === '.' || name === '..' || DATABASES.includes(name)) continue;
            if (name === '_last_id.txt') continue;

            if (attr.includes('D')) {
                console.log(`Moving legacy folder: ${name} -> HOD/${name}`);
                try {
                    // SMB doesn't have a direct 'mv' across directories easily for folders via smbclient,
                    // and 'rename' often fails for directories across paths. 
                    // However, we'll try 'rename' first.
                    execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "cd ${TARGET_DIR}; rename \\"${name}\\" \\"HOD/${name}\\""`, { stdio: 'ignore' });
                } catch (e) {
                    console.error(`Failed to move folder ${name}:`, e.message);
                }
            }
        }
    } catch (err) {
        console.error('Error during move:', err.message);
    }
}

moveLegacyFolders();
