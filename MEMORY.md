# MEMORY.md - Long-Term Memory

## Identity
- **Name**: Curator
- **Creature**: Workspace Curator
- **Vibe**: Thoughtful, organized, and vigilant.
- **Emoji**: 🏛️
- **Affiliation**: Hamburg Overhead Door

## The Human: William Best
- **Role**: Operations at Hamburg Overhead Door.
- **Location**: 5659 Herman Hill Rd, Hamburg, NY 14075.
- **Contact**: william@hamburgdoor.com | 716-649-3600 (Main) | 716-312-7890 (Direct, Ext. 123).

## Host Environment
- **Host**: Fedora 43 (Workstation Edition).
- **Security Goal**: Hardened business environment with automatic updates and Tailscale-only remote access.
- **Secure IP**: 100.85.240.73 (Tailscale)

## Registered Agents Ecosystem

### 1. main (Curator 🏛️) — Me
- **Agent Dir**: `/home/william/.openclaw/workspace`
- **Role**: Central orchestrator — routes alerts, delegates tasks
- **Channel**: WebChat (direct), Telegram bridge
- **Model**: deepseek/deepseek-v4-flash
- **Tools**: `coding` profile, elevated enabled (webchat)
- **Skills**: `extraDirs` → workspace root added

### ⚠️ Gmail Archive Lesson (2026-04-30)
Messages landing in `CATEGORY_FORUMS` (like Service Requests from `servicerequest@hamburgdoor.com`) lack the `INBOX` label. `--remove-inbox` has NO effect. Archive must explicitly remove `CATEGORY_FORUMS` (and `CATEGORY_PERSONAL` if present) to truly hide from all inbox tabs. Baked into the curation and sync-monitor skills.

### 2. gmail-agent (G-Mon 📧) — Communications Specialist
- **Agent Dir**: `/home/william/.openclaw/agents/gmail-agent`
- **Workspace Dir**: `/home/william/.openclaw/workspace/gmail-agent`
- **Mission**: Inbox triage, draft responses, emergency repair alerts for william@hamburgdoor.com
- **Version**: V2.1 — 2026-04-30 (skill-based architecture)
- **Model**: deepseek/deepseek-v4-flash (explicitly pinned, no drift)
- **Cron**: Gmail sync every **15 min** (isolated, delivery: none, timeout: 120s)
- **Cron ID**: `03fdfeff-63e4-4887-913d-4461fd3bdd3e`
- **Skills**: `gmail-sync-monitor`, `hamburg-door-email-curation`, `jen-telegram-alert`
- **Curation Rules** (defined in skills, summarized here):
    - **GreenSky** (`Label_18`): noreply@greenskycredit.com — label & archive, alert for 50% deposit/WO updates
    - **Web Estimator** (`Label_19`, blue): priceestimator@hamburgdoor.com — label & archive, noise only
    - **Service Requests** (`Label_20`): servicerequest@hamburgdoor.com — label & archive, remove CATEGORY_FORUMS explicitly
    - **Staff Attendance** (`attendance`, blue): billgeary@hamburgdoor.com / jen@hamburgdoor.com, subject starts "Staff" — label & archive
    - **Service Schedule** (`service-schedule`, blue): Airiana@hamburgdoor.com — subject "Service Schedule"/"PUSH ALL RESI SERVICE" — label & archive
    - **Before & After Photos** (`before-&-after`, blue): subject contains "Before & After"/"Before and After" — label & archive, forward to TT Bot
    - **Urgency**: 🔴 urgent (broken equipment, Major FS, GreenSky 50% deposit, "handle right away" WOs)

### 3. ts-picture-agent 📸 — Visual Specialist
- **Agent Dir**: `/home/william/.openclaw/agents/ts-picture-agent`
- **Workspace Dir**: `/home/william/.openclaw/workspace/ts-picture-agent`
- **Mission**: Multi-DB photo pipeline for HOD ticket images
- **Databases**: MS SQL Server (`hod-edge` / 192.168.1.15) for branches `HOD`, `WNY`, `OHD`
- **Storage**: SMB Share (`\\hod-edge\SHARED\TicketPics`) organized by Branch and TicketID
- **Web Service**: LAN Photo Viewer (`http://192.168.1.118:3000`) — multi-DB tabs, search, rotation, batch actions, print layouts (1 or 4 per page)
- **Automation**: Hourly sync via `sync-cron-multi.js` (M-F 8-5, Sat 9-12)
- **Dead scripts archived**: iterative prototypes moved to `archive/`, only active scripts remain in root

### 4. transformation-tuesday-bot 🎨 — Social Media Agent
- **Agent Dir**: `/home/william/.openclaw/agents/transformation-tuesday-bot`
- **Workspace Dir**: `/home/william/.openclaw/workspace/transformation-tuesday-bot`
- **Mission**: Weekly Tuesday before/after garage door install photos to Facebook/Instagram
- **Brand voice**: Professional, proud, grateful, manufacturer tags (@OverheadDoor, @GenieCompany, @WayneDalton)
- **Status**: Registered in config. **Not yet operational** — needs Facebook/Instagram API auth, cron schedule, and approval workflow

### 5. fedora-maintenance-bot 🛠️ — System Maintenance Agent
- **Agent Dir**: `/home/william/.openclaw/agents/fedora-maintenance-bot`
- **Workspace Dir**: `/home/william/.openclaw/workspace/fedora-maintenance-bot`
- **Mission**: Monitor, maintain, and optimize Fedora 43 host for HOD OpenClaw gateway
- **Capabilities**:
    - **Auto-update**: `dnf upgrade --refresh` daily via systemd timer (2am) with auto-reboot on kernel/core changes
    - **Security audit**: firewalld, SELinux, SSH config, listening ports, fail2ban, auditd
    - **Hardening**: one-shot secure-hardening.sh script (completed)
- **Skill**: `fedora-auto-update` registered
- **Status**: ✅ **Fully operational** as of 2026-04-30 09:39 — 2am daily dnf upgrade, security audit post-update, SELinux-hardened service path

### Consolidated: dash-man 📊 → Curator 🏛️
- **Decision (2026-04-30 09:19):** dash-man was registered but never trained. Its sole responsibility (maintaining the architecture dashboard at `/home/william/.openclaw/canvas/agent-architecture/index.html`) has been consolidated into Curator. One less agent to maintain.
- **Agent removed** from `openclaw.json` agents list. Workspace files kept for reference.

### Telegram Bridge (Not a separate agent)
- **Platform**: Telegram (@Modularhod_bot)
- **Paired User**: 8384679080
- **Relationship**: Channel binding to `main` session, not a standalone agent
- **Known issue**: IPv6 connectivity — Telegram fallback to sticky IPv4 (ETIMEDOUT on IPv6). Normal.

### Deprecated / Removed
- **test-and-measurement-instrumentation 🔬**: Was planned as T&M specialist but never registered in config or given an agent directory. Removed from registry.
- **Workspace Dir**: `/home/william/.openclaw/workspace/fedora-maintenance-bot`
- **Mission**: Monitor, maintain, and optimize Fedora 43 host for HOD OpenClaw gateway
- **Capabilities**:
    - **Auto-update**: `dnf upgrade --refresh` daily via systemd timer (2am) with auto-reboot on kernel/core changes
    - **Security audit**: firewalld, SELinux, SSH config, listening ports, fail2ban, auditd
    - **Hardening**: one-shot idempotent script to lock down perimeter
    - **Logging**: `/var/log/fedora-auto-update.log` + `journalctl -u fedora-auto-update`
- **Skill**: `fedora-auto-update` registered in config
- **Status**: Trained. Pending sudo actions: `schedule-update.sh` + `secure-hardening.sh`

## Skills Inventory (new)
- **fedora-auto-update**: Daily dnf upgrade at 2am + reboot-on-kernel + security hardening

## Gateway Performance (2026-04-29 Fixes)
- **Problem**: gmail-agent DeepSeek API calls hung for 2-4 minutes, blocking the event loop. Config apply loops from protected-path errors caused cascading restarts. Bonjour mDNS watchdog spam added log noise.
- **Fix 1**: Added `timeoutSeconds: 120` to gmail-agent cron payload (prevents >2min hangs)
- **Fix 2**: Set `discovery.mdns.mode: "off"` to disable bonjour/mDNS advertiser noise

## Canonical Registry
- **`REGISTRY.md`** in workspace is the canonical system registration document.
- Security: firewalld `drop` zone, SELinux enforcing, fail2ban active (SSH, 360s), auditd active, SSH key-only
- Schedule: `fedora-auto-update` daily 2am EDT, `dnf5-automatic` 6:49am, `dnf-makecache` ~4h, `fstrim` weekly Mon
- Models: DeepSeek V4 Flash primary, Gemini 3.1 Pro & 3 Flash fallbacks

## Git & GitHub
- **Remote**: `github.com/sparkyandtheo/william.oc`
- **First commit**: `c51f0f1` — 14 files (workspace core, architecture page, memory)
- **Cron**: `Daily Git Sync` at 11:00 PM ET — auto-commits + pushes workspace changes
- **Excluded**: `openclaw.json` (tokens), `auth-profiles.json`, sessions, media

## Security
- SSH active, Firewall hardened, `dnf5-automatic` configured.
- Config has `gateway.controlUi.allowInsecureAuth=true` (security warning flagged on startup)
