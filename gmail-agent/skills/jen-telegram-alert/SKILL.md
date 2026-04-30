---
name: jen-telegram-alert
description: Catch-all notification for emails from jen@hamburgdoor.com that do not match any existing curation rule. When a Jen Kuhn email appears in the inbox and none of the established rules apply (not Staff attendance, not Before & After), forward a summary via Telegram to William and then archive. Use alongside hamburg-door-email-curation skill.
---

# Jen Kuhn — Telegram Alert

## Trigger

This rule fires for emails from **jen@hamburgdoor.com** that reach the inbox **after** all other curation rules have been evaluated and none matched.

## Rule

| | |
|---|---|
| **Match** | `jen@hamburgdoor.com` — email was NOT caught by any other curation rule (Staff attendance, Before & After, or any other existing rule) |
| **Label** | `jen-alert` (blue) |
| **Action** | Send Telegram → Archive |

## Telegram Message Format

Send a concise Telegram message to William with:

```
📧 Jen Kuhn — {Subject}

{First 200 chars of body or snippet}

From: jen@hamburgdoor.com
Date: {Date}
```

## Agent Instructions

When processing the inbox during a Gmail sync:

1. Run the **hamburg-door-email-curation** rules first
2. Check remaining unread inbox emails for any from jen@hamburgdoor.com
3. If found and not already labeled by another rule → notify via Telegram → label `jen-alert` → archive
