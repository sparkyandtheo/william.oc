# Gmail Agent — Curator Registration Document

**Date:** 2026-04-29  
**Agent:** gmail-agent  
**Runtime:** OpenClaw (DeepSeek v4 Flash, pinned)  
**Cron:** Gmail Sync — every 15 min, isolated session  
**Delivery:** none (webchat-only, no spurious notifications)

---

## Automated Email Curation Rules

All rules follow the same pattern: **identify → label (blue) → archive**. No workflow or response steps unless noted.

### 1. Daily Staff Attendance
| | |
|---|---|
| **Match** | `billgeary@hamburgdoor.com` OR `jen@hamburgdoor.com` — subject begins with `"Staff"` (e.g., "Staff 4-29-26") |
| **Label** | `attendance` (blue) |
| **Action** | Archive |
| **Rationale** | Daily morning email listing who is absent/late. Awareness only. |

### 2. Web Estimator Logging
| | |
|---|---|
| **Match** | `priceestimator@hamburgdoor.com` — subject contains `"Has Just Used Your Estimator!"` (ThreeSixty) |
| **Label** | `web-estimator` (blue) |
| **Action** | Archive |
| **Rationale** | Web price estimator notifications. Log only. |

### 3. Service Schedule Updates
| | |
|---|---|
| **Match** | `Airiana@hamburgdoor.com` — subject contains `"Service Schedule"` OR `"PUSH ALL RESI SERVICE"` |
| **Label** | `service-schedule` (blue) |
| **Action** | Archive |
| **Rationale** | Daily tech capacity / push notices from Airiana. Awareness only. |

### 4. Service Request Logging
| | |
|---|---|
| **Match** | `Servicerequest@hamburgdoor.com` |
| **Label** | `Service Requests` |
| **Action** | Archive |
| **Rationale** | Service request notifications. Not action items. |

### 5. Before & After Photos
| | |
|---|---|
| **Match** | Subject contains `"Before & After"` OR `"Before and After"` — photos of completed work. Usually from Jen Kuhn. |
| **Label** | `before-&-after` (blue) |
| **Action** | Archive entire thread (including all replies) |
| **Forward** | Photos and details sent to **transformation-tuesday-bot** agent for Transformation Tuesday post processing |
| **Rationale** | Before/after shots for social media. Archived from inbox, forwarded to TT Bot. |

### 6. GreenSky Curation & Workflow
| | |
|---|---|
| **Match** | `noreply@greenskycredit.com` OR internal emails mentioning "Greensky" |
| **Label** | `Greensky` |
| **Action** | Archive (after labeling) |
| **Special** | 50% deposit workflow — agent alerts William when a transaction request is detected |

**GreenSky Workflow:**
1. Sales rep says customer is "applying" or "going with Greensky" → alert William to log in and submit 50% deposit
2. "Transaction Authorized" email arrives → alert William to update WO, reply to sender, advise submission to Jason

---

## Downstream Agents

### transformation-tuesday-bot

| Parameter | Value |
|---|---|
| **Agent ID** | `transformation-tuesday-bot` |
| **Name** | Transformation Tuesday Bot |
| **Agent Directory** | `/home/william/.openclaw/agents/transformation-tuesday-bot` |
| **Workspace** | `/home/william/.openclaw/workspace/transformation-tuesday-bot` |
| **Tools Profile** | `full` |
| **Model** | `deepseek/deepseek-v4-flash` (inherits default) |
| **Purpose** | Weekly before-and-after social media posts for Hamburg Overhead Door |

**Posting Platforms:** Facebook, Instagram (via Meta Business Suite)  
**Cadence:** Tuesdays  
**Content:** Before/after garage door photos with manufacturer tagging  
**Input Pipeline:** Receives forwarded before & after email data from **gmail-agent** via Gmail Sync cron

**Pending Setup:**
- [ ] Meta/Facebook API credentials
- [ ] Photo sourcing workflow
- [ ] Tuesday cron job (post schedule)
- [ ] Post template finalization
- [ ] Approval flow (review vs auto-publish)

---

## Inter-Agent Pipeline

```
Gmail (inbox)
     │
     ▼
Gmail Sync Cron (every 15 min)
     │
     ├─ Staff attendance ──► label + archive
     ├─ Web estimator ────► label + archive
     ├─ Service schedule ──► label + archive
     ├─ Service request ──► label + archive
     ├─ Before & After ───► label + archive ──► FORWARD to TT Bot
     └─ Greensky ─────────► label + archive + alert William
                                    │
                                    ▼
                         transformation-tuesday-bot
                                    │
                           (Tuesday cron job)
                                    │
                                    ▼
                         Facebook + Instagram post
```

---

## Infrastructure Configuration

| Setting | Value |
|---|---|
| **Model** | `deepseek/deepseek-v4-flash` (explicitly pinned in cron payload) |
| **Cron Schedule** | Every 15 minutes |
| **Session Type** | Isolated |
| **Delivery** | `none` (no channel configured — webchat only) |
| **Cron Job ID** | `03fdfeff-63e4-4887-913d-4461fd3bdd3e` |

---

## Testing & Validation

| Test | Status |
|---|---|
| Web Estimator rule (multiple submissions) | ✅ Labeled `web-estimator`, archived |
| Staff Attendance rule (Staff 4-29-26) | ✅ Labeled `attendance`, removed from inbox |
| Service Schedule Update (Airiana) | ✅ Rule added, pending next cron run |
| Before & After forwarding pipeline | ✅ Rule added, pending trigger |
| GreenSky deposit detection | ✅ Active — alerts on "Transaction Authorized" |
| GreenSky 50% deposit workflow | ⚠️ Manual — agent alerts, William logs in |
| Model pinning (DeepSeek) | ✅ All recent runs clean, no Google 429 errors |

---

## Source Files

- **Gmail Rules:** `/home/william/.openclaw/workspace/gmail-agent/memory/email_rules.md`
- **Gmail Agent:** `/home/william/.openclaw/agents/gmail-agent/`
- **TT Bot SOUL:** `/home/william/.openclaw/agents/transformation-tuesday-bot/SOUL.md`
- **TT Bot Config:** `/home/william/.openclaw/workspace/transformation-tuesday-bot/social-config.json`
- **TT Bot Checklist:** `/home/william/.openclaw/workspace/transformation-tuesday-bot/AGENTS.md`
- **Gmail Cron:** Gateway-managed (job ID: `03fdfeff-63e4-4887-913d-4461fd3bdd3e`)
