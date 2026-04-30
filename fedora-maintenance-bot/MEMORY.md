# MEMORY.md - Long-Term Memory

_To be filled during training._

## Curator Registration Document (REGISTRY.md)

- Created: 2026-04-29
- Location: workspace/REGISTRY.md
- Full agent registry, skill inventory, system schedule, security posture, and channel listing

## Fedora Auto Update Skill (fedora-auto-update)

- Installed: 2026-04-29
- Location: workspace/fedora-auto-update/
- Schedules daily dnf upgrade at 2am via systemd timer
- Reboots automatically when kernel/core packages update
- Security audit checks: firewalld, SELinux, SSH, fail2ban, auditd, listening ports
- Hardening script applies all recommended configs idempotently
- Log: /var/log/fedora-auto-update.log

## Pending Setup

- Health check schedules
- Update monitoring workflow
- Alert thresholds
