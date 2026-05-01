# Curator Registration — Gmail Agent (G-Mon)

> **Agent ID:** `gmail-agent`  
> **Identity:** G-Mon 📧  
> **Version:** V2.2 — 2026-04-30  
> **Runtime:** DeepSeek V4 Flash (`deepseek/deepseek-v4-flash`)  
> **Account:** william@hamburgdoor.com  
> **Gateway:** OpenClaw on Fedora (Linux 6.19.14)  
> **Workspace:** `/home/william/.openclaw/workspace/gmail-agent/`

---

## Changelog

| Date | Version | Changes |
|---|---|---|
| 2026-04-30 | V2.7 | Action-needed emails now trigger Telegram alert instead of silent archive |
| 2026-04-30 | V2.6 | Added read-and-assess step: archive info-only, leave action-needed in inbox |
| 2026-04-30 | V2.5 | Added Syracuse (orange) and Buffalo GDS (lime green) rules |
| 2026-04-30 | V2.4 | Added Clopay rule (yellow label) for all @clopay.com manufacturer communications |
| 2026-04-30 | V2.3 | Added 360psg rule (red label) for Manzella Marketing blog approval emails |
| 2026-04-30 | V2.2 | Broadened Service Schedule and Staff Attendance rules; added re-archive step for replies on labeled threads; documented CATEGORY_FORUMS archive requirement |
| 2026-04-30 | V2.1 | Corrected Service Requests match to all `servicerequest` variants; created `gmail-sync-monitor` skill |
| 2026-04-30 | V2.0 | Initial skill-based architecture (3 skills) |
| 2026-04-29 | V1.0 | Initial registration |

---

## 1. Architecture (Skill-Based)

The agent's email curation logic is packaged into three formal skills. Each skill lives in `skills/<name>/SKILL.md` with bundled references as needed.

```
gmail-agent/
├── skills/
│   ├── gmail-sync-monitor/           # Top-level orchestration
│   │   └── SKILL.md                  # Poll → route → log → respond
│   ├── hamburg-door-email-curation/  # 6 curation rules
│   │   ├── SKILL.md                  # Rules tables, urgency, summary format
│   │   └── references/
│   │       └── greensky-workflow.md  # Detailed GreenSky deposit workflow
│   └── jen-telegram-alert/           # Fallback for unmatched Jen emails
│       └── SKILL.md                  # Label → Telegram → archive
├── REGISTRATION.md                   # ← This document (authoritative)
├── memory/
│   ├── email_rules.md                # (Archived — rules now live in skills)
│   └── YYYY-MM-DD-cron-log.md        # Daily cycle logs
├── STATUS.md                         # Self-diagnostic status
└── (AGENTS.md, SOUL.md, USER.md, TOOLS.md)
```

*Stale docs `agent_registration.md`, `registration.md`, and `memory/email_rules.md` are all marked SUPERSEDED/ARCHIVED and point here.*

### Skill Descriptions

| Skill | Role | Skill File | Available |
|---|---|---|---|
| **gmail-sync-monitor** | Orchestrator — polls Gmail, re-archives replies on labeled threads, runs curation, logs, responds | `skills/gmail-sync-monitor/SKILL.md` | ✅ |
| **hamburg-door-email-curation** | 8 curation rules: attendance, estimator, schedule, service requests, before/after, 360psg blog approvals, Clopay, GreenSky | `skills/hamburg-door-email-curation/SKILL.md` | ✅ |
| **jen-telegram-alert** | Catch-all for unmatched `jen@hamburgdoor.com` emails → Telegram alert → archive | `skills/jen-telegram-alert/SKILL.md` | ✅ |

### Execution Flow

```
Gmail (inbox)
     │
     ▼
gmail-sync-monitor cron (every 15 min, isolated session)
     │
     ├─ [Step 1] Query inbox: gog gmail search 'in:inbox is:unread'
     │
     ├─ [Step 2] Broad sweep: gog gmail search 'is:unread newer_than:1d'
     │
     ├─ [Step 3a] Re-Archive Check
     │     └─ For any message on a thread ALREADY labeled with a curation
     │        label (Service Requests, web-estimator, etc.):
     │        → Apply label to new reply message
     │        → --remove INBOX
     │        → --remove CATEGORY_* (FORUMS, PERSONAL, UPDATES)
     │        → Log as "re-archive" → skip curation rules
     │
     ├─ [Step 3b] Curation Rules (hamburg-door-email-curation)
     │     ├─ Staff attendance ───────► label + archive
     │     ├─ Web estimator ─────────► label + archive (entire thread)
     │     ├─ Service schedule ──────► label + archive
     │     ├─ Service requests ──────► label + archive (broad sweep)
     │     ├─ Before & After ────────► label + archive + FORWARD to TT Bot
     │     ├─ 360psg blog approvals ─► label (red) + archive
     │     └─ GreenSky ──────────────► label + archive + ALERT William
     │
     ├─ [Step 4] Jen Fallback (jen-telegram-alert)
     │     └─ Unmatched jen@emails ──► Telegram → label → archive
     │
     ├─ [Step 5] Log cycle to memory/YYYY-MM-DD-cron-log.md
     │
     └─ [Step 6] Respond
           ├─ Nothing urgent → NO_REPLY
           └─ Urgent (GreenSky deposit, before/after alert, WO urgent) → send summary
```

### Skill Dependencies

| Skill | Depends On | Tooling Requirements |
|---|---|---|
| gmail-sync-monitor | hamburg-door-email-curation, jen-telegram-alert, gog | gog CLI with Gmail OAuth |
| hamburg-door-email-curation | gog (labeling, archive, forward) | Gmail scopes |
| jen-telegram-alert | Telegram messaging config | OpenClaw Telegram channel |

---

## 2. Cron Jobs

### 2.1 Gmail Sync — Every 15 Minutes

| Field | Value |
|---|---|
| **Job ID** | `03fdfeff-63e4-4887-913d-4461fd3bdd3e` |
| **Name** | Gmail Sync |
| **Schedule** | Every 15 min (`everyMs: 900000`) |
| **Model** | `deepseek/deepseek-v4-flash` |
| **Session** | Isolated (no parent context) |
| **Delivery** | None (silent) |
| **Payload** | References **gmail-sync-monitor** skill |
| **Consecutive errors** | 0 |

### 2.2 Daily Git Sync — 23:00 EDT

| Field | Value |
|---|---|
| **Job ID** | `a79d6251-464b-40e9-a53a-f888eae158ca` |
| **Name** | Daily Git Sync |
| **Schedule** | Daily at 23:00 EDT |
| **Session** | Isolated |

---

## 3. Email Curation Rules

All rules follow the **identify → label (blue) → archive** pattern unless noted. The canonical rule definitions are in `skills/hamburg-door-email-curation/SKILL.md`. This section summarizes for quick reference.

### 3.1 Staff Availability & Scheduling

| | |
|---|---|
| **Match** | `billgeary@hamburgdoor.com` OR `jen@hamburgdoor.com` — subject begins with `"Staff"` OR contains `"Lunch schedule"` OR contains `"meetings today"` |
| **Label** | `attendance` (blue) |
| **Action** | Archive |
| **Notes** | Staff communications about availability, attendance, lunch schedules, meeting availability. Also catches replies on same threads. Awareness only. |

### 3.2 Web Estimator Logging

| | |
|---|---|
| **Match** | `priceestimator@hamburgdoor.com` / `web-estimator@hamburgdoor.com` — subject contains `"Has Just Used Your Estimator!"`, including `Re:` replies from staff on archived threads |
| **Label** | `web-estimator` (blue) |
| **Action** | Archive entire thread, mark all read |
| **Notes** | Log lead submissions. Catch replies from internal staff re-archiving. |

### 3.3 Service Schedule Updates

| | |
|---|---|
| **Match** | `Airiana@hamburgdoor.com` — subject contains `"Service Schedule"` OR `"PUSH"` (covers both `"PUSH ALL RESI SERVICE"` and `"PLEASE TRY TO START PUSHING COMMERCIAL..."`) |
| **Label** | `service-schedule` (blue) |
| **Action** | Archive |
| **Notes** | Daily tech capacity and push notices from Airiana — both residential and commercial dispatch. Awareness only. |

### 3.4 Service Request Logging

| | |
|---|---|
| **Match** | Any sender address at `@hamburgdoor.com` where local part contains `servicerequest` (case-insensitive) — covers `servicerequest@`, `servicerequests@`, `Servicerequest@`. Also catches threads already labeled `Service Requests`. |
| **Label** | `Service Requests` (blue) |
| **Action** | Archive |
| **Notes** | Forwards from Rich Giambra, automated "Proposal Approved" from `donotreply`. These land in **CATEGORY_FORUMS**, not inbox. Archive requires explicitly removing `CATEGORY_FORUMS`/`CATEGORY_PERSONAL` — removing `INBOX` alone has no effect since they don't have it. Must also handle replies from internal staff (Jacob, etc.) on already-labeled threads — see **Step 3a re-archive** in execution flow. |

### 3.5 Before & After Photos

| | |
|---|---|
| **Match** | Subject contains `"Before & After"` OR `"Before and After"` — photos of completed work. Usually from Jen Kuhn or forwarded by Jen/Mario. |
| **Label** | `before-&-after` (blue) |
| **Action** | Archive entire thread |
| **Forward** | Email contents and photos to **transformation-tuesday-bot** agent |
| **Notes** | Social media candidates for Transformation Tuesday. Photos must reach TT Bot. |

### 3.6 360 PSG Blog Approvals
| | |
|---|---|
| **Match** | `davidr@manzellamarketing.com` — subject contains `"Blog Approval"` OR `"Next Blog"` |
| **Label** | `360psg` (red) |
| **Action** | Archive |
| **Notes** | Blog approval requests from Manzella Marketing. Recurring ~monthly. |

### 3.7 Syracuse Wayne Dalton
| | |
|---|---|
| **Match** | Sender domain `@waynedaltonofsyracuse.com` (Thomas Cummings) |
| **Label** | `Syracuse` (orange) |
| **Action** | Archive |
| **Notes** | Wayne Dalton of Syracuse — tech support, billing, IT issues. |

### 3.8 Buffalo Garage Door Services
| | |
|---|---|
| **Match** | Sender domain `@buffalogds.com` (Mary Girasole, Mark Pinto) |
| **Label** | `Buffalo GDS` (lime green) |
| **Action** | Archive |
| **Notes** | Buffalo GDS — web requests and communications. |

### 3.9 Clopay Manufacturer Communications
| | |
|---|---|
| **Match** | Sender domain `@clopay.com` (Clopay Doors, Clopay Corporation, MyDoor admin) |
| **Label** | `Clopay` (yellow) |
| **Action** | Archive |
| **Notes** | All manufacturer communications — marketing, product updates, price changes, account notices. |

### 3.10 GreenSky Financing & Deposit Workflow

| | |
|---|---|
| **Match** | `noreply@greenskycredit.com` OR internal emails mentioning "Greensky", "GS", or "GSKY" |
| **Label** | `Greensky` (blue) |
| **Action** | Archive after processing |
| **Special** | 50% deposit workflow (see `skills/hamburg-door-email-curation/references/greensky-workflow.md` for full detail) |

**Deposit Workflow Steps:**
1. Sales rep says customer is "applying" or "going with Greensky" → alert William to log into portal and submit 50% deposit
2. "Transaction Authorized" email arrives → alert William to update WO, reply to sender, advise submission to Jason

### Urgency Classification

| Priority | Criteria | Response |
|---|---|---|
| **Urgent** | GreenSky approvals, "broken" equipment, Major FS requests, "handle right away" WOs | Alert William |
| **Normal** | Standard reports (Verizon), staff updates, daily scheduling | NO_REPLY |

---

## 4. Jen Telegram Alert (Fallback)

After all curation rules are applied, any remaining inbox email from `jen@hamburgdoor.com` triggers this fallback:

| | |
|---|---|
| **Match** | `jen@hamburgdoor.com` — not caught by any curation rule above |
| **Label** | `jen-alert` (blue) |
| **Action** | Send Telegram summary → archive |

**Telegram Format:**
```
📧 Jen Kuhn — {Subject}

{First 200 chars snippet}

From: jen@hamburgdoor.com
Date: {Date}
```

---

## 5. Label Registry

All labels managed by G-Mon on william@hamburgdoor.com. Convention: blue color (`#4a86e8`) for curation labels.

| Label | Gmail Label ID | Color | Purpose | Archive Note |
|---|---|---|---|---|
| `360psg` | `Label_25` | Red | Manzella Marketing blog approvals | Standard |
| `Greensky` | `Label_18` | Blue | GreenSky financing emails | Standard |
| `web-estimator` | `Label_19` | Blue | Web price estimator notifications | Standard |
| `Service Requests` | `Label_20` | Blue | Service request notifications | **Must remove CATEGORY_FORUMS** not INBOX |
| `attendance` | — | Blue | Daily staff attendance | Standard |
| `service-schedule` | — | Blue | Daily service schedule / push notices | Standard |
| `before-&-after` | — | Blue | Before & After photo submissions | Standard, + forward to TT Bot |
| `jen-alert` | — | Blue | Unmatched Jen Kuhn emails | Standard, + Telegram |
| `Clopay` | `Label_26` | Yellow | Clopay manufacturer communications | Standard |
| `Syracuse` | `Label_27` | Orange | Wayne Dalton of Syracuse communications | Standard |
| `Buffalo GDS` | `Label_28` | Lime green | Buffalo Garage Door Services communications | Standard |

---

## 6. Downstream Agents

| Agent ID | Name | Role | Status |
|---|---|---|---|
| `transformation-tuesday-bot` | TT Bot 📸 | Before/after social media posts (Facebook/Instagram) — receives forwarded Before & After emails | ⏳ Pending setup |
| `main` | Curator 🏛️ | Central orchestrator — routes alerts from G-Mon to William via WebChat/Telegram | ✅ Active |

### Inter-Agent Communication

| From | To | Trigger | Content |
|---|---|---|---|
| G-Mon → Curator | `main` session | Urgent curation event (GreenSky deposit, broken WO) | Alert summary sent via sessions_send or delivered in session |
| G-Mon → TT Bot | `transformation-tuesday-bot` | Before & After photo email detected | Full email contents + photo attachments, forwarded |
| Curator → William | WebChat/Telegram | Urgent alert received from G-Mon | Formatted alert with thread ID and action needed |

---

## 7. Key Files

| File | Purpose |
|---|---|
| `skills/gmail-sync-monitor/SKILL.md` | Orchestration skill — poll, re-archive, curation, log, respond |
| `skills/hamburg-door-email-curation/SKILL.md` | 6 curation rules (canonical) |
| `skills/hamburg-door-email-curation/references/greensky-workflow.md` | GreenSky deposit workflow reference |
| `skills/jen-telegram-alert/SKILL.md` | Jen unmatched email fallback |
| `memory/YYYY-MM-DD-cron-log.md` | Daily cycle logs |
| `STATUS.md` | Self-diagnostic status |

---

## 8. Configuration

| Setting | Value |
|---|---|
| **Model** | `deepseek/deepseek-v4-flash` |
| **Auth** | gog CLI (Google OAuth, full Gmail scopes) |
| **Account** | william@hamburgdoor.com |
| **Cron Schedule** | Every 15 minutes |
| **Session Type** | Isolated |
| **Delivery** | None (silent — no channel announcements) |

---

*Document updated 2026-04-30 — V2.2: Airiana PUSH broadened, re-archive step added, CATEGORY_FORUMS archive requirement documented.*
