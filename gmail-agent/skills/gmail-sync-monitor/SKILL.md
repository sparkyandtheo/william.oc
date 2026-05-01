---
name: gmail-sync-monitor
description: Poll william@hamburgdoor.com for new email, apply curation rules, log results, and respond appropriately. Covers the full inbox-check lifecycle: query Gmail via gog CLI, route through hamburg-door-email-curation and jen-telegram-alert skills, maintain daily sync logs, and produce correct output (NO_REPLY or alert).
---

# Gmail Sync Monitor

## Overview

This is the top-level orchestration skill for G-Mon's email monitoring. Every 15 minutes (via cron), poll `william@hamburgdoor.com`, apply curation rules, handle unmatched Jen emails, log the cycle, and return the right response.

## Prerequisites

- `gog` CLI installed and authenticated with `william@hamburgdoor.com` (full Gmail OAuth scopes)
- **hamburg-door-email-curation** skill loaded and applied first
- **jen-telegram-alert** skill loaded and applied as fallback
- Memory files at `memory/YYYY-MM-DD-cron-log.md` for daily logs

## Step-by-Step Procedure

Execute these steps in order on every polling cycle.

### Step 1: Query Inbox for Unread

```bash
# Find unread inbox threads (this filters out auto-categorised noise)
gog gmail search 'in:inbox is:unread' --account william@hamburgdoor.com --max 50
```

- If **zero results**, proceed to Step 2 (broad sweep).
- If **results found**, capture thread IDs, subjects, senders, and dates for later processing.

### Step 2: Broad Unread Sweep

```bash
# Check for anything arriving in non-inbox categories
gog gmail search 'is:unread newer_than:1d' --account william@hamburgdoor.com --max 50
```

- Note items in CATEGORY_UPDATES, CATEGORY_FORUMS, CATEGORY_PERSONAL for awareness.
- These rarely match curation rules but should be tracked in the log.

### Step 3a: Re-Archive Replies on Labeled Threads

Before applying curation rules, check if any inbox messages belong to **threads that already have a curation label** (Service Requests, web-estimator, Greensky, attendance, service-schedule, before-&-after). If so:

1. The parent thread already got curated — this is just a reply re-surfacing
2. Apply the same label to the new message
3. Archive: `--remove INBOX` AND `--remove CATEGORY_*` (FORUMS, PERSONAL, UPDATES)
4. Record in log as "re-archive" — no further curation needed, skip to next email

This handles the common pattern where someone replies to an archived thread (e.g., Jacob Stubley replies to a Service Request, or Beth replies to a Web Estimator) and the reply lands fresh in the inbox.

### Step 3b: Apply Curation Rules

For remaining new inbox emails identified in Step 1:

1. Run through all rules in **hamburg-door-email-curation** in order.

2. For each match:
   - Apply the specified Gmail label (e.g. `attendance`, `web-estimator`)
   - **Read the email body** and assess: does William need to reply, approve, or take any action?

3. **Decide whether to archive:**

| Assessment | Action |
|---|---|
| Purely informational — schedule, notification, FYI, no response needed | Archive (remove INBOX + CATEGORY_*). NO_REPLY. |
| Needs William to reply, approve, review, decide, or follow up | **Leave in inbox** (mark read). **Send Telegram alert** with summary. |
| Urgent — GreenSky deposit, broken WOs, customer emergency | **Leave in inbox**. **Send Telegram alert** with full details + recommended action. |

4. Record match in log with the decision (archived vs left in inbox).

5. **Track what was caught** — any email matched by a curation rule is done. Skip to next email.

**⚠️ Archive edge cases:**
   - For messages with `INBOX` label → use `--remove-inbox` (standard archive).
   - For messages in `CATEGORY_FORUMS` or `CATEGORY_PERSONAL` WITHOUT an `INBOX` label (like Service Requests) → `--remove-inbox` has **no effect**. Remove the category label explicitly: `gog gmail messages modify <msgId> --remove CATEGORY_FORUMS --remove CATEGORY_PERSONAL --account william@hamburgdoor.com`.
   - To check which labels a message has: `gog gmail messages get <msgId> --json --account william@hamburgdoor.com` and inspect the `labelIds` array.
   - Always also apply `--remove-label UNREAD` to mark the message as read.

### Step 4: Jen Telegram Fallback

For remaining unprocessed inbox emails from `jen@hamburgdoor.com`:

1. Apply the **jen-telegram-alert** skill:
   - Label as `jen-alert`
   - Send Telegram notification to William
   - Archive

### Step 5: Log the Cycle

Append to the daily log file at `memory/YYYY-MM-DD-cron-log.md` with this format:

```markdown
## Gmail Sync ({HH:MM AM/PM TZ})
- **Inbox `is:unread`**: {count} found — {details}
- **Inbox (all)**: {any read threads of interest}
- **Broad `is:unread` sweep**: {count} items — {categories/sources}
- **Messages after {last check timestamp}**: {count} — {list items}
- **Curation Rules Check:**
  - **Staff attendance**: {Match/No match} ✅
  - **Web estimator**: {Match/No match} ✅
  - **Service schedule**: {Match/No match} ✅
  - **Service Requests**: {Match/No match} ✅
  - **Before & After**: {Match/No match} ✅
  - **Greensky**: {Match/No match} ✅
- **Jen Telegram Alert**: {triggered or not, with detail} ✅
- **Result**: {summary of actions taken}
```

### Step 6: Respond

| Condition | Response |
|---|---|
| No new actionable emails | `NO_REPLY` |
| Informational matches archived (attendance, estimator, schedule, Clopay, etc.) | `NO_REPLY` |
| Action-needed item left in inbox | **Send Telegram** with summary + rule name → `NO_REPLY` (Telegram is the delivery) |
| Urgent item (GreenSky deposit, broken WO, customer emergency) | **Send Telegram** with full details + recommended action → `NO_REPLY` |
| Jen alert triggered | Telegram already sent via skill; `NO_REPLY` |

**Telegram format for action-needed emails:**
```
📋 [{Rule Name}] {Subject}

{First 300 chars or key details}

From: {Sender}
```

**Telegram format for urgent items:**
```
🚨 {Subject}

{Full relevant details + what William needs to do}

From: {Sender}
Thread: {Link or ID}
```

## Error Handling

### gog CLI Failure
If `gog` commands fail (auth expired, network down):
1. Log the error to the daily cron log with the exact error message
2. Do NOT crash — note the failure and re-try on next cycle
3. If `gog` repeatedly fails (>3 consecutive cycles), alert William

### Label Application Failure
If Gmail label creation/application fails:
1. Try creating the label first if it doesn't exist
2. If creation also fails, note it in the log and proceed
3. Do not leave unprocessed emails in inbox — archive anyway

### Duplicate Processing
- Track processed thread IDs in the cycle log to avoid re-processing
- If a thread was already labeled in a prior cycle, skip it
- Use `gog gmail search 'in:inbox is:unread'` to only see truly new items

## Gmail CLI Quick Reference

```bash
# List labels
gog gmail labels list --account william@hamburgdoor.com

# Create a label
gog gmail labels create "attendance" --label-color '{"backgroundColor": "#4a86e8"}' --account william@hamburgdoor.com

# Apply label and remove INBOX (archive — for messages with INBOX label)
gog gmail labels add <msgId> --labels "attendance" --remove-inbox --account william@hamburgdoor.com

# Apply label and remove CATEGORY_FORUMS (archive — for messages WITHOUT INBOX, like Service Requests)
gog gmail messages modify <msgId> --add-labels "Service Requests" --remove CATEGORY_FORUMS --remove CATEGORY_PERSONAL --account william@hamburgdoor.com

# Mark read
gog gmail messages modify <msgId> --remove-label UNREAD --account william@hamburgdoor.com

# Get message details
gog gmail messages get <msgId> --account william@hamburgdoor.com --json

# Search by timerange
gog gmail search 'after:2026/04/30 before:2026/05/01' --account william@hamburgdoor.com --max 50
```

## Common Gotchas

- **Replies on archived threads** — a new reply to an archived thread will re-appear in inbox. Check for estimator-pattern subjects even when sender is not `priceestimator@hamburgdoor.com`.
- **Jen's GreenSky emails** — Jen often forwards GreenSky threads. If subject mentions "GSKY" or "Greensky", the GreenSky rule catches it before the jen-telegram-alert fires. This is correct behavior.
- **Non-inbox items** — Voicemails, call recordings, and scheduled reports land in CATEGORY_UPDATES/CATEGORY_FORUMS, not inbox. Most don't match curation rules and should be noted in the log but not acted on.
- **Service Requests in CATEGORY_FORUMS** — Exception to the above: `servicerequest@hamburgdoor.com` / `servicerequests@hamburgdoor.com` emails (Google Group) arrive in CATEGORY_FORUMS, not inbox, and often don't have the INBOX label. The broad unread sweep must check these specifically. The rule matches both the group address and any "Service Requests" label already applied.
- **Archive = remove ALL inbox labels** — For messages in CATEGORY_FORUMS or CATEGORY_PERSONAL without INBOX, archiving requires removing the CATEGORY_* label explicitly. `modify --remove INBOX` alone won't help. Run `--remove CATEGORY_FORUMS` and/or `--remove CATEGORY_PERSONAL` to truly hide them from all inbox tabs.
- **Label colors** — Use `"#4a86e8"` (blue) for curation labels to match William's convention.
