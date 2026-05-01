# ts-picture-agent 📸 — Script Reference

## Active Script

| File | Purpose | Status |
|---|---|---|
| `sync-cron-multi.js` | Multi-DB (HOD, WNY, OHD) photo sync from MS SQL → SMB share | ✅ Production |
| `cleanup-smb.js` | Clean up orphaned files on SMB share | ⚡ On-demand |

## Archives

All iterative prototypes and debug utilities moved to `archive/`:

| File | Purpose |
|---|---|
| `archive/sync-batch.js` | Prototype |
| `archive/sync-cron.js` | Prototype |
| `archive/sync-pics.js` | Prototype |
| `archive/sync-refined.js` | Prototype |
| `archive/sync-stream.js` | Prototype |
| `archive/sync-stream-fixed.js` | Prototype |
| `archive/sync-stream-final.js` | Prototype |
| `archive/sync-to-smb.js` | Prototype |
| `archive/test-db.js` | Prototype |
| `archive/check-recent.js` | Debug utility |
| `archive/check-tables.js` | Debug utility |
| `archive/check-ticketpic.js` | Debug utility |
| `archive/debug-tickets.js` | Debug utility |
| `archive/fix-structure.js` | Debug utility |
| `archive/move-legacy.js` | Debug utility |
| `archive/search-base64.js` | Debug utility |

## Viewer

| File | Purpose |
|---|---|
| `viewer/server.js` | LAN Photo Viewer (http://192.168.1.118:3000) |
