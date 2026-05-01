# G-Mon 📧 — Agent Status (2026-04-30)

## Identity
- **Agent:** G-Mon (gmail-agent)
- **Account:** william@hamburgdoor.com
- **Architecture:** Skill-based V2.1 (3 formal skills)

## Skills
| Skill | Purpose |
|---|---|
| `gmail-sync-monitor` | Top-level orchestration: poll → route → log → respond |
| `hamburg-door-email-curation` | 6 curation rules (attendance, estimator, schedule, service requests, before/after, GreenSky) |
| `jen-telegram-alert` | Fallback: unmatched Jen emails → Telegram → archive |

## Curation Rules
| Rule | Sender/Subject | Label | Action |
|---|---|---|---|
| Staff Attendance | `billgeary@`/`jen@`, subject "Staff..." | `attendance` | Archive |
| Web Estimator | `priceestimator@`, subject "Has Just Used Your Estimator!" | `web-estimator` | Archive + mark read |
| Service Schedule | `Airiana@`, subject "Service Schedule"/"PUSH ALL RESI SERVICE" | `service-schedule` | Archive |
| Service Requests | `*servicerequest*@hamburgdoor.com`, any case | `Service Requests` | Archive (remove CATEGORY_FORUMS!) |
| Before & After | Subject "Before & After"/"Before and After" | `before-&-after` | Archive + forward to TT Bot |
| GreenSky | `noreply@greenskycredit.com` or "Greensky"/"GS" mentions | `Greensky` | Archive + alert on deposits |
| Jen Fallback | `jen@` unmatched by above | `jen-alert` | Telegram → archive |

## Performance
- **Cron:** Every 15 min (isolated, silent delivery)
- **Last runs:** ✅ All passing (0 consecutive errors)
- **Model:** deepseek/deepseek-v4-flash (pinned)
- **Auth:** gog CLI (Google OAuth)

## Key Lesson (2026-04-30)
Service Requests land in CATEGORY_FORUMS without INBOX label. Archive requires `--remove CATEGORY_FORUMS` explicitly. Baked into both curation and sync-monitor skills.

## Stale Docs Removed
- ~~`agent_registration.md`~~ — superseded by REGISTRATION.md (deleted)
- ~~`registration.md`~~ — superseded by REGISTRATION.md (deleted)
- ~~`memory/email_rules.md`~~ — content now in skills (archived pointer file kept)

## Open Items
- None. Agent is stable and operational.
