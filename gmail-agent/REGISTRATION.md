# Curator Registration Document

> **Agent:** Gmail Agent (gmail-agent)  
> **Identity:** G-Mon 📧  
> **Version:** V1 — 2026-04-29  
> **Runtime:** DeepSeek V4 Flash (`deepseek/deepseek-v4-flash`)  
> **Account:** william@hamburgdoor.com  
> **Gateway:** OpenClaw on Fedora (Linux 6.19.14)

---

## 1. Purpose

The Curator monitors william@hamburgdoor.com and triages incoming email. It applies labels, archives noise, and flags actionable items — specifically GreenSky financing workflows, web estimator logs, and service request notifications.

---

## 2. Cron Jobs

### Gmail Sync — Every 15 minutes

| Field | Value |
|---|---|
| **Schedule** | Every 15 min (`everyMs: 900000`) |
| **Model** | `deepseek/deepseek-v4-flash` |
| **Session** | Isolated (no parent context) |
| **Delivery** | None (silent — no channel announcements) |
| **Last run** | OK (0 consecutive errors) |

**Task:** Check william@hamburgdoor.com for new emails and apply rules per `memory/email_rules.md`.

---

## 3. Email Curation Rules

### 3.1 GreenSky Financing

| | |
|---|---|
| **Sender** | `noreply@greenskycredit.com` (or internal emails referencing "Greensky") |
| **Label** | `Greensky` (Gmail label ID `Label_18`) |
| **Archive** | Yes, after labeling |
| **Urgent Action** | Alert William for 50% deposit posting and WO updates |

### 3.2 Web Estimator Logs

| | |
|---|---|
| **Sender** | `priceestimator@hamburgdoor.com` (ThreeSixty) |
| **Subject pattern** | `"Exciting News: ... Has Just Used Your Estimator!"` |
| **Label** | `web-estimator` (Gmail label ID `Label_19`) |
| **Archive** | Yes — log only, no action needed |

### 3.3 Service Requests

| | |
|---|---|
| **Sender** | `Servicerequest@hamburgdoor.com` |
| **Label** | `Service Requests` (Gmail label ID `Label_20`) |
| **Archive** | Yes — notification log, no action needed |

### 3.4 General Urgency Detection

| Priority | Indicators |
|---|---|
| **Urgent** | New GreenSky approvals, "broken" equipment, Major FS requests, "handle right away" WOs |
| **Normal** | Standard reports (Verizon), staff updates, daily scheduling |
| **No reply** | If nothing urgent found → `NO_REPLY` |

---

## 4. Label Registry

All labels managed by the Curator on william@hamburgdoor.com:

| Label | Gmail ID | Color | Visibility | Purpose |
|---|---|---|---|---|
| `Greensky` | `Label_18` | — | Show in label list | GreenSky financing emails |
| `web-estimator` | `Label_19` | Blue | Show in label list | Web price estimator notifications |
| `Service Requests` | `Label_20` | — | Show in label list | Service request notifications |

---

## 5. Configuration

### 5.1 Auth

- **Provider:** gog CLI (Google OAuth)
- **Account:** william@hamburgdoor.com
- **Scopes:** gmail, calendar, drive, contacts, docs, sheets, tasks, etc.
- **Token expiry:** Refresh via OAuth (last refresh: ongoing)

### 5.2 Agent Config

```json
{
  "id": "gmail-agent",
  "name": "Gmail Agent",
  "agentDir": "/home/william/.openclaw/agents/gmail-agent",
  "tools": { "profile": "full" }
}
```

### 5.3 Default Model

```json
{
  "model": { "primary": "deepseek/deepseek-v4-flash" }
}
```

---

## 6. Key Files

| File | Purpose |
|---|---|
| `memory/email_rules.md` | Full curation rules and priority definitions |
| `USER.md` | William's identity and preferences |
| `SOUL.md` | Agent persona (G-Mon) |
| `REGISTRATION.md` | This document |

---

## 7. Related Agents

| Agent ID | Name | Purpose |
|---|---|---|
| `main` | Curator 🏛️ | Central orchestrator — routes alerts, delegates tasks |
| `ts-picture-agent` 📸 | Picture Agent | Multi-DB photo pipeline — shares ticket-image context |
| `Modularhod_bot` 🤖 | Telegram Bot | Cross-platform messaging bridge |

## 8. Connections

### G-Mon → Ecosystem

| Connection | How |
|---|---|
| G-Mon → Curator | Urgent alerts delivered to main session → WebChat/Telegram |
| G-Mon → ts-picture-agent | Shared context: email service requests may reference ticket IDs that have photos in the pipeline |
| G-Mon → Modularhod_bot | Alerts forwarded to Telegram via Curator session binding |

### Master Registration

This agent is documented as part of the [Curator's full ecosystem registration](../REGISTRATION.md).

---

*This document updated 2026-04-29 to reflect cross-agent connections.*
