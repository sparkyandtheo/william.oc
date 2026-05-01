# MEMORY.md — Fedora Maintenance Bot 🛠️

## Identity
- **Name**: Fedora Maintenance Bot
- **Creature**: System Maintenance Agent
- **Vibe**: Reliable, vigilant, proactive
- **Affiliation**: Hamburg Overhead Door

## Status (2026-04-30) — ✅ Fully Operational

### What's Running

| Component | Status | Details |
|---|---|---|
| **Auto-update timer** | ✅ Active | 2am EDT daily via systemd timer |
| **dnf upgrade --refresh** | ✅ Verified | Runs at 02:00, logs to journal |
| **Security audit post-update** | ✅ Verified | Runs after every update |
| **Kernel reboot handling** | ✅ Configured | Auto-reboots 60s after kernel/core updates |
| **Security posture** | ✅ Enforcing | SELinux enforcing, firewalld drop zone, SSH key-only, fail2ban, auditd |

### Scripts

| Script | Location | Purpose |
|---|---|---|
| `fedora-update.sh` | `/usr/local/libexec/fedora-auto-update/` | dnf upgrade --refresh, reboot-if-needed |
| `security-audit.sh` | `/usr/local/libexec/fedora-auto-update/` | Post-update security posture check |
| `secure-hardening.sh` | `scripts/secure-hardening.sh` | One-shot hardening (already applied) |
| `schedule-update.sh` | `scripts/schedule-update.sh` | ⚠️ Installs to home dir — use the manual service unit instead |

### Systemd Units

| Unit | Type | Path |
|---|---|---|
| `fedora-auto-update.service` | oneshot | `/etc/systemd/system/fedora-auto-update.service` |
| `fedora-auto-update.timer` | timer | `/etc/systemd/system/fedora-auto-update.timer` |

### Notes
- SELinux blocked the original setup because scripts lived in `/home/william/` with `user_home_t` context
- Fix: scripts moved to `/usr/local/libexec/fedora-auto-update/` and service unit `ExecStart` updated
- Service runs as root (default), no `User=` override needed
- Logs: `journalctl -u fedora-auto-update.service -n 50 --no-pager`
