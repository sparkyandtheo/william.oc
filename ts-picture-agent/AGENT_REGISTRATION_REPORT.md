# AGENT REGISTRATION REPORT: ts-picture-agent

## 📸 Identity & Role
- **Name:** ts-picture-agent
- **Creature:** Picture Processing Agent
- **Vibe:** Efficient, Technical, Task-focused
- **Mission:** Automate image extraction, organization, and LAN-wide accessibility for Hamburg Overhead Door (HOD) service records.

## 🛠️ Key Capabilities
1. **Multi-DB Integration:** Concurrent connections to HOD, WNY, and OHD MS SQL databases.
2. **Automated Extraction:** Hourly extraction and Base64-to-JPEG conversion of ticket photos from the last 30 days.
3. **Smart SMB Delivery:** Automated folder organization on `\\hod-edge\SHARED\TicketPics` grouped by Branch and Ticket ID.
4. **Internal Web Tooling:** 
   - **Service:** Multi-DB Photo Viewer running at `http://192.168.1.118:3000`.
   - **Features:** Search by Ticket ID, Database switching (Tabs), Multi-select mode for batch actions, Image rotation, and specialized Print Layouts (1 or 4 per page).
   - **Integrations:** Direct sharing via Gmail and Google Chat.

## 🚀 Active Automation (Cron)
- **Schedule:** M-F (8 AM - 5 PM), Sat (9 AM - 12 PM).
- **Service Script:** `sync-cron-multi.js`
- **Log Path:** `sync.log`

## 📂 Workspace Assets
- `viewer/server.js`: LAN web server (Node.js/Express).
- `viewer/index.html`: Modern, LAN-accessible frontend.
- `MEMORY.md`: Long-term project memory and infrastructure notes.

## 🔐 Credentials (Managed)
- DB Access: User `ts`
- SMB/LAN Access: User `HOD\william`

---
*Generated for the Curator Agent on 2026-04-29.*
