# OpenClaw Gateway — Hamburg Overhead Door

**Fedora 43** · Tailscale `100.85.240.73`

Multi-agent OpenClaw gateway powering HOD operations, communications, and automation.

## Agents (5 registered)

| ID | Name | Role | Status |
|---|---|---|---|
| `main` | Curator 🏛️ | Central orchestrator + architecture dashboard | ✅ Active |
| `gmail-agent` | G-Mon 📧 | Email triage & communication | ✅ Active |
| `ts-picture-agent` | Picture Agent 📸 | Multi-DB photo pipeline | ✅ Active |
| `fedora-maintenance-bot` | Fedora Bot 🛠️ | System maintenance | ✅ Operational |
| `transformation-tuesday-bot` | TT Bot 🎨 | Social media | ⏳ Needs API auth + cron |

## Infrastructure

- **Gateway**: OpenClaw on loopback (18789, 18791)
- **Network**: Tailscale-only remote access
- **Security**: firewalld (drop), SELinux enforcing, fail2ban, SSH key-only
- **Updates**: Daily dnf 2am EDT via systemd timer

## External Services

- Google Workspace (Gmail API)
- Telegram (@Modularhod_bot)
- MS SQL Server (hod-edge, 3 DBs)
- LAN Photo Viewer (192.168.1.118:3000)
