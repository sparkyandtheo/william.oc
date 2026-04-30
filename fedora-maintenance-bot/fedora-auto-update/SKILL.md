---
name: fedora-auto-update
description: "Automate Fedora system updates, security hardening, and reboot management. Use when the user asks about: scheduling or running dnf upgrade, checking security updates, ensuring reboot after kernel updates, auditing or hardening the security perimeter (firewall, SELinux, SSH, fail2ban, auditd), or setting up a maintenance schedule. Not for non-Fedora distros (check /etc/os-release first)."
---

# Fedora Auto Update

Automated daily system maintenance for Fedora Linux: upgrades at 2am,
smart reboot detection, and security hardening.

## Quick Start — Set Up the Schedule

Run as root to install the systemd timer (daily at 2am):

```bash
sudo ./scripts/schedule-update.sh
```

This creates:
- `fedora-auto-update.service` — runs the update + audit scripts
- `fedora-auto-update.timer` — triggers the service daily on `OnCalendar=daily`

## Scripts

### `scripts/fedora-update.sh`
Runs `dnf upgrade --refresh -y`, then checks if a reboot is needed
(`dnf needs-restarting -r`) and reboots with a 60-second warning if so.

- Logs to `/var/log/fedora-auto-update.log`
- Safe for crontab/systemd timer use

### `scripts/security-audit.sh`
Read-only audit. Checks: firewalld, SELinux, SSH config, listening ports,
fail2ban, auditd, and systemd sandboxing. Prints coloured pass/warn/fail.

### `scripts/secure-hardening.sh`
**Idempotent** — applies hardening changes:
- Enables firewalld, sets default zone to `drop`
- Enforces SELinux (config change; reboot required)
- Hardens SSHD (key-only, no root password login)
- Installs & enables `dnf-automatic` (security errata between full runs)
- Installs & enables `fail2ban` (SSH jail) and `auditd`

**Run once** after initial setup, or any time the audit finds regressions.

### `scripts/schedule-update.sh`
One-shot setup: writes systemd unit/timer files, reloads, enables.

## Manual Operations

Run the update now:
```bash
sudo systemctl start fedora-auto-update
```

Check when the timer will fire next:
```bash
systemctl list-timers fedora-auto-update.timer
```

View logs:
```bash
journalctl -u fedora-auto-update -n 50 --no-pager
```

Run a standalone audit:
```bash
sudo ./scripts/security-audit.sh
```

## Security Standards

See [`references/security-standards.md`](references/security-standards.md)
for the full hardening checklist, firewalld zone strategy, and SELinux guidance.

## What This Skill Tells the Agent

When the user asks about updates, security, or maintenance:

1. **"Update my system"** → Run `fedora-update.sh` or start the service
2. **"Set up auto updates at 2am"** → Run `schedule-update.sh` (as root)
3. **"Check my security"** → Run `security-audit.sh` and explain findings
4. **"Harden my system"** → Run `secure-hardening.sh` (explain each change first)
5. **"Set up alerts"** → Configure the cron/alert mechanism in OpenClaw config
