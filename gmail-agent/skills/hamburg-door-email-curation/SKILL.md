---
name: hamburg-door-email-curation
description: Curate and process incoming emails for Hamburg Overhead Door (HOD). Use when checking william@hamburgdoor.com for new mail. Covers daily staff attendance, web estimator notifications, service schedule updates, service request logging, before/after photo forwarding to social media bot, and GreenSky financing workflow with 50% deposit processing. Also includes urgency classification, summary formatting, and agent-to-agent forwarding rules.
---

# Hamburg Overhead Door — Email Curation

## Overview

Automated curation of william@hamburgdoor.com. Each email is identified, labeled, archived (or forwarded), and summarized per the rules below.

## Curation Rules

All rules follow the same core pattern: **identify → label (blue) → archive**. Exceptions noted.

### 1. Daily Staff Attendance
| | |
|---|---|
| **Match** | `billgeary@hamburgdoor.com` OR `jen@hamburgdoor.com` — subject begins with `"Staff"` (e.g., "Staff 4-29-26") |
| **Label** | `attendance` (blue) |
| **Action** | Archive |
| **Notes** | Lists who is absent/late for the day. Awareness only. |

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
| **Match** | `Airiana@hamburgdoor.com` — subject contains `"Service Schedule"` OR `"PUSH ALL RESI SERVICE"` |
| **Label** | `service-schedule` (blue) |
| **Action** | Archive |
| **Notes** | Daily tech capacity / push notices. Awareness only. |

### 4. Service Request Logging
| | |
|---|---|
| **Match** | `Servicerequest@hamburgdoor.com` |
| **Label** | `Service Requests` |
| **Action** | Archive |
| **Notes** | Service request notifications. Not action items. |

### 5. Before & After Photos
| | |
|---|---|
| **Match** | Subject contains `"Before & After"` OR `"Before and After"` — photos of completed work. Usually from Jen Kuhn or forwarded by Jen/Mario. |
| **Label** | `before-&-after` (blue) |
| **Action** | Archive entire thread (including replies) |
| **Forward** | Send the email contents and photo attachments to the **transformation-tuesday-bot** agent for Transformation Tuesday post processing |
| **Notes** | These are social media candidates. Do NOT discard the photos — they must reach the TT Bot. |

### 6. GreenSky Curation & Workflow
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
