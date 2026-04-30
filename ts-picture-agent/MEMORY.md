# MEMORY.md - Long-Term Memory

## Hamburg Overhead Door - Picture Sync Project
- **Goal:** Automatically sync and organize service ticket photos from the MS SQL database to a network share.
- **Agent Name:** ts-picture-agent (📸)
- **User:** William (Hamburg Overhead Door)

### Key Infrastructure
- **DB Server:** `hod-edge` (`192.168.1.15`)
- **DB Credentials:** User `ts` (MS SQL)
- **File Server:** `\\hod-edge\SHARED` (SMB)
- **SMB Credentials:** `HOD\william`

### Sync Logic
- **Frequency:** Hourly (M-F 8-5, Sat 9-12).
- **Scope:** Last 30 days of `TicketPic` table.
- **Organization:** `S:\TicketPics\<TicketID>\<FileName>.jpg`.
- **Implementation:** Node.js (`sync-cron.js`) triggered by crontab.

### Important Notes
- Pictures are stored in the DB as Base64 strings in `TicketPic.PicData`.
- Use `smbclient` for uploads to avoid permanent mount issues on this specific host.
- Memory limit for Node was increased during initial bulk testing but streaming is preferred for production.
