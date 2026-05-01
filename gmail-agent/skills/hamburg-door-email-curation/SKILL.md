---
name: hamburg-door-email-curation
description: Curate and process incoming emails for Hamburg Overhead Door (HOD). Use when checking william@hamburgdoor.com for new mail. Covers daily staff attendance, web estimator notifications, service schedule updates, service request logging, before/after photo forwarding to social media bot, and GreenSky financing workflow with 50% deposit processing. Also includes urgency classification, summary formatting, and agent-to-agent forwarding rules.
---

# Hamburg Overhead Door — Email Curation

## Overview

Automated curation of william@hamburgdoor.com. Each email is identified, labeled, read for actionability, then archived or left in inbox accordingly.

### Core Pattern

1. **Identify** — match sender/subject per rule
2. **Label** — apply label with designated color
3. **Read & Assess** — read the body and assess: does William need to reply, approve, or take action?
4. **Decide** —
   - **Informational only** (just FYI, no response needed) → **Archive** (remove INBOX + CATEGORY_*)
   - **Needs action** (reply, approval, decision, follow-up) → **Leave in inbox**, mark read
5. **Mark urgent** — if it's something William would want to know about immediately, send a summary alert

### Urgency Rules

| If... | Then... |
|---|---|
| Purely informational (schedules, reports, notifications) | Archive, NO_REPLY |
| Needs William to reply or approve | Leave in inbox (read), **Telegram alert** |
| GreenSky deposit, broken WOs, urgent customer issues | Leave in inbox, **Telegram alert** with recommended action |

## Curation Rules

### 1. Staff Availability & Scheduling
| | |
|---|---|
| **Match** | `billgeary@hamburgdoor.com` OR `jen@hamburgdoor.com` — subject begins with `"Staff"` (e.g., "Staff 4-29-26") OR subject contains `"Lunch schedule"` OR subject contains `"meetings today"` |
| **Label** | `attendance` (blue) |
| **Action** | Archive |
| **Notes** | Staff communications about availability, attendance, scheduling — who's absent/late, lunch schedules, meeting availability for the day. Also applies to replies on same threads (e.g., Jen replying to Bill's lunch schedule). Awareness only. |

### 2. Web Estimator Logging
| | |
|---|---|
| **Match** | `priceestimator@hamburgdoor.com` OR any email replying to a web-estimator thread (subject contains `"Has Just Used Your Estimator!"`, including `"Re:"` replies) |
| **Label** | `web-estimator` (blue) |
| **Action** | Archive entire thread, mark all messages read |
| **Notes** | Log only. Track submitter name, time, and ZIP for lead follow-up awareness. **Replies from internal staff (Jordan, Beth, etc.) must also be caught** — they arrive as new messages on archived threads and should skip the inbox entirely. Check for estimator-pattern subjects even when the sender is not priceestimator@hamburgdoor.com. |

### 3. Service Schedule Updates
| | |
|---|---|
| **Match** | `Airiana@hamburgdoor.com` — subject contains `"Service Schedule"` OR contains `"PUSH"` (covers both "PUSH ALL RESI SERVICE" and "PLEASE TRY TO START PUSHING COMMERCIAL...") |
| **Label** | `service-schedule` (blue) |
| **Action** | Archive |
| **Notes** | Daily tech capacity / push notices from Airiana. Covers both residential and commercial push notifications. Awareness only. |

### 4. Service Request Logging
| | |
|---|---|
| **Match** | Any sender address at `@hamburgdoor.com` where the local part contains `servicerequest` (case-insensitive), regardless of plural/singular/capitalization — covers `servicerequest@`, `servicerequests@`, `Servicerequest@`, etc. Also catches threads already labeled `Service Requests` even if sender doesn't match. |
| **Label** | `Service Requests` |
| **Action** | Archive |
| **Notes** | Notifications forwarded from Rich Giambra, automated "Proposal Approved" from `donotreply`, etc. Land in **CATEGORY_FORUMS**, not inbox — check the broad unread sweep, not just inbox query. Already labeled "Service Requests" by Gmail filter, but must be caught by curation to get fully processed (archived, logged).
| **Archive note** | These messages typically lack the `INBOX` label entirely. To truly archive (hide from Forums tab), **remove both `CATEGORY_FORUMS` and `CATEGORY_UPDATES` labels explicitly** when `--remove-inbox` has no effect. Use `gog gmail messages modify <msgId> --remove <CATEGORY> --account ...` per label. |

### 5. Before & After Photos
| | |
|---|---|
| **Match** | Subject contains `"Before & After"` OR `"Before and After"` — photos of completed work. Usually from Jen Kuhn or forwarded by Jen/Mario. |
| **Label** | `before-&-after` (blue) |
| **Action** | Archive entire thread (including replies) |
| **Forward** | Send the email contents and photo attachments to the **transformation-tuesday-bot** agent for Transformation Tuesday post processing |
| **Notes** | These are social media candidates. Do NOT discard the photos — they must reach the TT Bot. |

### 6. 360 PSG Blog Approvals
| | |
|---|---|
| **Match** | `davidr@manzellamarketing.com` — subject contains `"Blog Approval"` OR `"Next Blog"` |
| **Label** | `360psg` (red) |
| **Action** | Archive |
| **Notes** | Blog approval requests from Manzella Marketing (David Rechin Jr). Previously missed by all rules and caught by jen-telegram-alert fallback. Recurring — ~monthly. |

### 7. Syracuse Wayne Dalton
| | |
|---|---|
| **Match** | Sender domain `@waynedaltonofsyracuse.com` (Thomas Cummings) |
| **Label** | `Syracuse` (orange) |
| **Action** | Archive |
| **Notes** | Wayne Dalton of Syracuse — technical support, billing, IT issues from Thomas Cummings. |

### 8. Buffalo Garage Door Services
| | |
|---|---|
| **Match** | Sender domain `@buffalogds.com` (Mary Girasole, Mark Pinto) |
| **Label** | `Buffalo GDS` (lime green) |
| **Action** | Archive |
| **Notes** | Buffalo GDS — web requests, communications from Mary Girasole or Mark Pinto. |

### 9. Clopay Manufacturer Communications
| | |
|---|---|
| **Match** | Sender domain `@clopay.com` (Clopay Doors, Clopay Corporation, MyDoor admin, etc.) |
| **Label** | `Clopay` (yellow) |
| **Action** | Archive |
| **Notes** | Manufacturer communications — marketing, product updates, price changes, production downtime, account/admin notices. Catch all Clopay sends as a single block. |

### 10. GreenSky Curation & Workflow
| | |
|---|---|
| **Match** | `noreply@greenskycredit.com` OR internal emails mentioning "Greensky" or "GS" |
| **Label** | `Greensky` |
| **Action** | Archive after processing |

**50% Deposit Workflow:**

1. **Application detected:** When a sales rep says customer is "applying" or "going with Greensky" — alert William to log into the GreenSky portal and submit a 50% deposit transaction request.

2. **Transaction Authorized:** When a "Transaction Authorized by Customer" email arrives — alert William to:
   - Update the Work Order (WO) with deposit info
   - Reply to sender (Sales) confirming deposit received
   - Advise Sales they can submit the order to Jason

## Urgency Classification

| Priority | Criteria |
|---|---|
| **Urgent** | New GreenSky approvals needing posting; WOs marked "handle right away" or mentioning "broken" equipment; Major FS requests |
| **Normal** | Standard scheduled reports (Verizon); general staff updates unless action required |

## Summary Style

Format summaries for William using these patterns:

| Type | Format |
|---|---|
| **Financial** | `[GreenSky] Customer {Name} approved ${Amount} for App ID {ID}.` |
| **Work Orders** | `[WO] {WO#} — {Issue summary} from {Sender}.` |
| **Voicemail** | `[VM] New voicemail from {Number} regarding {Context}.` |
| **Staffing** | `[Staff] {Date} — {Who is out/late}.` |
| **Schedule** | `[Schedule] {Date} — {Capacity summary}.` |
| **Estimator** | `[Estimator] {Name} ({ZIP}) — {Time}.` |

## Response Rules

- If no urgent mail found: **NO_REPLY**.
- Always include **Thread ID** or **Message ID** for easy follow-up.

## Rule Change Notifications

When curation rules are created, modified, or deleted, forward the updated rule list to the **test-and-measurement-instrumentation** agent so it stays synchronized.

## References

See [references/greensky-workflow.md](references/greensky-workflow.md) for detailed GreenSky processing steps.
