const { execSync } = require('child_process');

const SMB_BASE = '//192.168.1.15/SHARED';
const SMB_USER = 'HOD/william';
const SMB_PASS = 'Theangrouseiscoming19@';
const TARGET_DIR = 'TicketPics';

const DATABASES = ['HOD', 'WNY', 'OHD'];

function fixFolderStructure() {
    console.log(`Cleaning up legacy folder structure...`);
    
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
                console.log(`Deleting legacy folder: ${name}`);
                try {
                    // Recursive delete attempt
                    execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "cd ${TARGET_DIR}; deltree \\"${name}\\""`, { stdio: 'ignore' });
                } catch (e) {
                    // Fallback to rmdir
                    try {
                        execSync(`smbclient "${SMB_BASE}" -U "${SMB_USER}%${SMB_PASS}" -c "cd ${TARGET_DIR}; rmdir \\"${name}\\""`, { stdio: 'ignore' });
                    } catch (e2) {}
                }
            }
        }
    } catch (err) {
        console.error('Error during fix:', err.message);
    }
}

fixFolderStructure();
