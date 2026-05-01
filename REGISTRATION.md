# Curator Registration Document

> **Agent:** Curator (main)
> **Identity:** 🏛️ Curator
> **Version:** V2 — 2026-04-30
> **Runtime:** DeepSeek V4 Flash (`deepseek/deepseek-v4-flash`)
> **Gateway:** OpenClaw on Fedora 43 (Linux 6.19.14)
> **Secure IP:** 100.85.240.73 (Tailscale)

---

## 1. Purpose

The Curator is the central operations hub for Hamburg Overhead Door's digital ecosystem. It orchestrates specialized sub-agents, maintains the workspace, triages communications, and serves as William's primary interface across WebChat and Telegram.

The Curator does not do everything — it knows who does what and routes accordingly.

---

## 2. The Ecosystem

```
                    ┌─────────────────────┐
                    │     William Best     │
                    │  (Hamburg Overhead   │
                    │     Door Ops)        │
                    └──────┬──────┬───────┘
                           │      │
              WebChat ─────┤      ├──── Telegram
                           │      │
                    ┌──────┴──────┴──────────┐
                    │        🏛️ CURATOR      │
                    │    (main agent)        │
                    │  Orchestrator & Hub    │
                    │  + architecture        │
                    │  dashboard owner       │
                    └────┬──────────┬────────┘
                         │          │
              ┌──────────┤          ├──────────┐
              ▼          ▼          ▼          ▼
      ┌──────────┐ ┌──────────┐ ┌──────────────┐
      │  G-Mon   │ │ ts-pic-  │ │ Fedora-Maint │
      │  📧      │ │ agent 📸 │ │ Bot 🛠️      │
      │  Gmail   │ │ Picture  │ │ System Sec   │
      │  Monitor │ │ Pipeline │ │ + Auto-Upd.  │
      └──────────┘ └──────────┘ └──────────────┘
                                    │
                                    ▼
                           ┌──────────────┐
                           │ TT Bot       │
                           │ 🎨           │
                           │ Social Media │
                           │ (pending)    │
                           └──────────────┘
```

### 2.1 Agent Overview

| Agent ID | Name | Creature | Emoji | Role | Status |
|---|---|---|---|---|---|
| `main` | Curator | Workspace Curator | 🏛️ | Central orchestrator, workspace management, dashboards, chat interface | ✅ Active |
| `gmail-agent` | G-Mon | Digital Gmail Monitor | 📧 | Email triage, labeling, urgency detection | ✅ Active |
| `ts-picture-agent` | ts-picture-agent | Picture Processing Agent | 📸 | Multi-DB photo extraction, SMB delivery, LAN viewer | ✅ Active |
| `fedora-maintenance-bot` | Fedora Bot | System Maintenance | 🛠️ | Auto-updates, security hardening, monitoring | ✅ Operational |
| `transformation-tuesday-bot` | TT Bot | Social Media | 🎨 | Facebook/Instagram before/after posts | ⏳ Needs API auth + cron |

---

## 3. Agent Details

### 3.1 Curator (main) — 🏛️

| Attribute | Value |
|---|---|
| **Vibe** | Thoughtful, organized, vigilant |
| **Affiliation** | Hamburg Overhead Door — 5659 Herman Hill Rd, Hamburg, NY 14075 |
| **Company Phone** | 716-649-3600 |
| **Direct Line** | 716-312-7890 (Ext. 123) |
| **Interfaces** | WebChat (primary), Telegram (via Modularhod_bot) |

**Capabilities:**
- Workspace curation and file management
- Sub-agent orchestration and delegation
- Heartbeat-driven proactive checks
- Cross-platform continuity (WebChat ↔ Telegram)

**Key Files:**
| File | Purpose |
|---|---|
| `IDENTITY.md` | Self-identity |
| `SOUL.md` | Persona and core truths |
| `USER.md` | William's identity & preferences |
| `MEMORY.md` | Long-term curated memory |
| `AGENTS.md` | Behavior rules |
| `TOOLS.md` | Local tool notes |
| `HEARTBEAT.md` | Heartbeat task management |
| `REGISTRATION.md` | This document |

---

### 3.2 G-Mon (gmail-agent) — 📧

| Attribute | Value |
|---|---|
| **Vibe** | Sharp, proactive, efficient |
| **Account** | william@hamburgdoor.com |
| **Cron** | Every 15 min (isolated, silent delivery) |
| **Last Run** | ✅ OK (0 consecutive errors) |

**Curation Rules:**
| Sender | Label | Gmail ID | Action |
|---|---|---|---|
| `noreply@greenskycredit.com` | `Greensky` | `Label_18` | Label & archive; alert for 50% deposit/WO updates |
| `priceestimator@hamburgdoor.com` | `web-estimator` | `Label_19` (blue) | Label & archive; log only |
| `Servicerequest@hamburgdoor.com` | `Service Requests` | `Label_20` | Label & archive; notification log |

**Urgency Tiers:**
| Priority | Indicators |
|---|---|
| 🔴 **Urgent** | New GreenSky approvals, broken equipment, Major FS, "handle right away" WOs |
| ⚪ **Normal** | Standard reports, staff updates, daily scheduling |
| 🔇 **No reply** | Nothing actionable found |

**Key Files:** `SOUL.md`, `IDENTITY.md`, `STATUS.md`, `REGISTRATION.md`, `agent_registration.md`
**Workspace:** `gmail-agent/`

**Rules:** `memory/email_rules.md`

---

### 3.3 ts-picture-agent — 📸

| Attribute | Value |
|---|---|
| **Vibe** | Efficient, technical, task-focused |
| **Databases** | MS SQL Server (`hod-edge` / 192.168.1.15) — `HOD`, `WNY`, `OHD` |
| **Storage** | SMB Share `\\hod-edge\SHARED\TicketPics` |
| **LAN Viewer** | `http://192.168.1.118:3000` |
| **Sync Schedule** | M-F 8 AM–5 PM, Sat 9 AM–12 PM |
| **Sync Script** | `sync-cron-multi.js` |

**Features:**
- Multi-DB tab switching
- Search by Ticket ID
- Image rotation & batch actions
- Print layouts (1 or 4 per page)
- Gmail/Google Chat sharing integration

**Key Files:** `MEMORY.md`, `SOUL.md`, `REGISTRATION.md`, `sync-cron-multi.js`, `viewer/`
**Workspace:** `ts-picture-agent/`

---

### 3.4 fedora-maintenance-bot — 🛠️

| Attribute | Value |
|---|---|
| **Vibe** | Reliable, vigilant, proactive |
| **Workspace** | `workspace/fedora-maintenance-bot/` |
| **Skill** | `fedora-auto-update` (daily dnf upgrade, reboot-on-kernel-change, security hardening) |
| **Cron** | 2 AM daily via systemd timer (not OpenClaw cron) |
| **Scripts** | `/usr/local/libexec/fedora-auto-update/` (system path for SELinux compat) |
| **Last run** | 2026-04-30 09:39 (success: upgrade + audit) |
| **Logs** | `journalctl -u fedora-auto-update.service` |

**Status: ✅ Operational** — All three actions completed:
1. ✅ `secure-hardening.sh` (firewalld, SELinux, SSH, fail2ban, auditd)
2. ✅ `schedule-update.sh` (systemd timer installed, later moved scripts to system path)
3. ✅ SELinux fix — scripts installed to `/usr/local/libexec/fedora-auto-update/`

### 3.5 transformation-tuesday-bot — 🎨

| Attribute | Value |
|---|---|
| **Vibe** | Professional, proud, grateful |
| **Workspace** | `workspace/transformation-tuesday-bot/` |
| **Mission** | Weekly before/after photos to Facebook & Instagram |
| **Status** | 🟡 Registered, not yet operational |

**Pending Setup:**
- ⏳ Facebook/Instagram API app creation & OAuth
- ⏳ Tuesday morning cron job
- ⏳ Approval flow (review vs auto-publish)

### 3.6 Architecture Dashboard

The agent architecture dashboard at `/home/william/.openclaw/canvas/agent-architecture/index.html` is maintained by **Curator 🏛️**. Previously assigned to a dedicated `dash-man` agent, this responsibility was consolidated into Curator to reduce agent count. The dashboard covers:

- All 5 registered agents with status indicators
- Data flow pipelines (email, photos, system)
- External services & infrastructure
- Gmail curation rules reference table

**File:** `/home/william/.openclaw/canvas/agent-architecture/index.html`
**CSS/JS framework:** Static HTML with embedded styles — no build tools, no dependencies.

### 3.7 Telegram Bridge (@Modularhod_bot)

Not a standalone agent — this is a Telegram channel bound to the `main` (Curator) session.

| Attribute | Value |
|---|---|
| **Platform** | Telegram |
| **Username** | @Modularhod_bot |
| **Paired User** | 8384679080 |
| **Mode** | DM + group chat (requireMention) |
| **Binding** | Session-bound to main agent |

---

## 4. Information Flow

### 4.1 Email → Alert Flow
```
Gmail (william@hamburgdoor.com)
  │
  ▼ (every 15 min)
G-Mon 📧 (gmail-agent)
  │
  ├── 🔴 Urgent found → Alert via main session → WebChat
  │                       └─→ Telegram (via Modularhod_bot binding)
  │
  ├── ⚪ Normal → Label & archive (silent)
  │
  └── 🔇 Nothing → NO_REPLY
```

### 4.2 Photo Pipeline Flow
```
MS SQL Server (hod-edge)
  │  HOD, WNY, OHD branches
  ▼ (hourly sync)
ts-picture-agent 📸
  │  Base64 → JPEG conversion
  ▼
SMB Share (\\hod-edge\SHARED\TicketPics)
  │  Organized by branch/TicketID
  ▼
LAN Photo Viewer (http://192.168.1.118:3000)
  │  Multi-DB tabs, search, batch actions
  ▼
  William (WebChat/Telegram/Desktop)
```

### 4.3 Telegram ↔ WebChat Bridge
```
William on Telegram (@Modularhod_bot)
  │
  ▼
Modularhod_bot (session-bound to main)
  │
  ▼
Curator 🏛️ (full tool access)
  │
  ├── Responds in same session
  ├── Delegates to G-Mon / ts-picture-agent
  └── Delivers reply back via Telegram
```

---

## 5. Host Infrastructure

| Component | Details |
|---|---|
| **OS** | Fedora 43 (Workstation Edition) |
| **Kernel** | Linux 6.19.14 |
| **Node.js** | v22.22.2 |
| **Gateway** | OpenClaw (local) |
| **Secure IP** | 100.85.240.73 (Tailscale) |
| **LAN IP (LAN Viewer)** | 192.168.1.118 |
| **DB Server** | hod-edge (192.168.1.15) |

### Security Posture
- SSH active, firewalld hardened
- `dnf5-automatic` configured for security updates
- Tailscale-only remote access
- Samba client removed from local zone

---

## 6. Cron Jobs

| Job | Agent | Schedule | Session | Delivery | Status |
|---|---|---|---|---|---|
| Gmail Sync | gmail-agent | Every 15 min | Isolated | None | ✅ OK |
| Daily Git Sync | main | Daily 23:00 EDT | Isolated | None | ✅ OK |
| TT Bot Tuesday Check | main | Tue 08:00 ET | Isolated | None | ✅ Scheduled |
| Photo Sync | ts-picture-agent | M-F 8-5, Sat 9-12 | System crontab | — | Active |
| Fedora Update | fedora-maintenance-bot | Daily 02:00 EDT | Systemd timer | — | Active |

---

## 7. Related Documents

| File | Location | Purpose |
|---|---|---|
| Curator REGISTRATION.md | `workspace/REGISTRATION.md` | 🏛️ This document (V2 — correct) |
| Curator MEMORY.md | `workspace/MEMORY.md` | Curator long-term memory |
| Curator README.md | `workspace/README.md` | Quick reference for all agents |
| G-Mon REGISTRATION.md | `workspace/gmail-agent/REGISTRATION.md` | 📧 Gmail agent registration (V2.1 — correct) |
| G-Mon STATUS.md | `workspace/gmail-agent/STATUS.md` | ⚠️ Stale (2026-04-29, pre-skill V1) |
| G-Mon Skills | `workspace/gmail-agent/skills/*/SKILL.md` | 3 formal curation & sync skills |
| ts-pic MEMORY.md | `workspace/ts-picture-agent/MEMORY.md` | 📸 Picture agent memory |
| Fedora REGISTRY.md | `workspace/fedora-maintenance-bot/REGISTRY.md` | 🛠️ ⚠️ Lists phantom test-and-measurement agent |
| TT Bot MEMORY.md | `workspace/transformation-tuesday-bot/MEMORY.md` | 🎨 Pending training |
| TT Bot social-config.json | `workspace/transformation-tuesday-bot/social-config.json` | Post template, API config (needs auth) |
| Dash-Man SOUL.md | `workspace/dash-man/SOUL.md` | 📊 Identity, pending training |
| Daily Notes | `workspace/memory/YYYY-MM-DD.md` | Daily operational logs |

---

## 8. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-04-29 | V1 | Initial registration. Curator documented with full agent ecosystem, information flow diagrams, and connected infrastructure. |
| 2026-04-30 09:11 | V2 | Full audit. Removed Modularhod_bot (Telegram bridge) + phantom test-and-measurement. Added dash-man, fedora bot, TT bot. Archived dead scripts. Fixed registry. |
| 2026-04-30 09:19 | V2.1 | **Streamlined.** Removed dash-man agent (consolidated into Curator). 5 agents total. Cleaned duplicate cron logs from root memory/. Fixed cron delivery artifacts. |
