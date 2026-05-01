# OpenClaw Curator Registration

**Generated:** 2026-04-29T15:24 EDT
**Host:** Fedora 43 — Tailscale `100.85.240.73`
**Platform:** Linux 6.19.14-200.fc43.x86_64 · Node v22.22.2 · Desktop (Chassis: 🖥️)

---

## 1. Instance

| Field | Value |
|---|---|
| Gateway Mode | Local |
| Gateway Port | `18789` (loopback) |
| Auth Mode | Token |
| Control UI | Enabled (insecure auth allowed for webchat) |
| Tailscale | Off (exit node) |
| Gateway PID | `118321` |

## 2. Agent Registry

### 2.1 Agent List

| # | ID | Name | Agent Dir | Tools Profile |
|---|---|---|---|---|
| 1 | `main` | **Curator** | `workspace` (shared) | coding |
| 2 | `ts-picture-agent` | Picture Agent | `agents/ts-picture-agent` | full |
| 3 | `gmail-agent` | Gmail Agent | `agents/gmail-agent` | full |
| 4 | `transformation-tuesday-bot` | Transformation Tuesday Bot | `agents/transformation-tuesday-bot` | full |
| 5 | `dash-man` | Dash-Man | `agents/dash-man` | full |
| 6 | `transformation-tuesday-bot` | Transformation Tuesday Bot | `agents/transformation-tuesday-bot` | full |
| 6 | `fedora-maintenance-bot` | **Fedora Maintenance Bot** 🛠️ | `agents/fedora-maintenance-bot` | full |

### 2.2 Defaults

| Field | Value |
|---|---|
| Primary Model | DeepSeek V4 Flash |
| Reasoning | Supported |
| Context Window | 1,000,000 tokens |
| Max Output Tokens | 384,000 |
| Fallback Models | Gemini 3.1 Pro, Gemini 3 Flash |

### 2.3 Auth Profiles

| Profile | Provider | Mode |
|---|---|---|
| `google:default` | Google | API Key |
| `deepseek:default` | DeepSeek | API Key |

## 3. Skill Inventory

| Skill | Type | Status | Source |
|---|---|---|---|
| `healthcheck` | Bundled | ✅ Active | OpenClaw core |
| `weather` | Bundled | ✅ Active | OpenClaw core |
| `browser-automation` | Bundled | ✅ Active | OpenClaw core |
| `taskflow` | Bundled | ✅ Active | OpenClaw core |
| `skill-creator` | Bundled | ✅ Active | OpenClaw core |
| `fedora-auto-update` | **Custom** 🆕 | ✅ Registered | `workspace/fedora-auto-update/` |

### fedora-auto-update

**Purpose:** Automated Fedora system maintenance — daily upgrades, intelligent reboot, and security hardening.

**Scripts:**

| Script | Purpose |
|---|---|
| `fedora-update.sh` | `dnf upgrade --refresh -y` → reboot-if-needed |
| `security-audit.sh` | Read-only perimeter audit (firewalld, SELinux, SSH, fail2ban, auditd, ports) |
| `secure-hardening.sh` | Idempotent hardening (drop zone, SELinux enforcing, SSH key-only, fail2ban, auditd) |
| `schedule-update.sh` | systemd timer installer |

**Installed artifacts:**

| Resource | Path |
|---|---|
| Timer | `/etc/systemd/system/fedora-auto-update.timer` |
| Service | `/etc/systemd/system/fedora-auto-update.service` |
| Log | `/var/log/fedora-auto-update.log` |

## 4. System Schedule (systemd timers)

| Timer | Trigger | Status |
|---|---|---|
| `dnf-makecache.timer` | Every ~4h | Active |
| `dnf5-automatic.timer` | Daily 06:49 EDT | Active |
| `fstrim.timer` | Weekly Mon 00:46 EDT | Active |
| `raid-check.timer` | Weekly Sun 01:00 EDT | Active |
| **`fedora-auto-update.timer`** 🆕 | **Daily 02:00 EDT** | **Active** |
| `logrotate.timer` | Daily 00:24 EDT | Active |
| `unbound-anchor.timer` | Daily 00:00 EDT | Active |

## 5. Security Perimeter (as of registration)

| Check | Status | Detail |
|---|---|---|
| Firewalld | ✅ **Hardened** | Default zone: `drop` |
| SELinux | ✅ **Enforcing** | |
| fail2ban | ✅ Active | SSH jail, bantime: 3600s |
| auditd | ✅ Active | Security event logging |
| SSH (public zone) | 🔐 Open | SSH + mdns + dhcpv6-client |
| OpenClaw gateway | 🔒 Loopback | Ports 18789, 18791 (localhost only) |
| Tailscale SSH | ✅ | Device IP: `100.85.240.73` |

## 6. Channels

| Channel | Status | Notes |
|---|---|---|
| Telegram | ✅ Enabled | Mention-required in groups, pairing-based DMs |
| WebChat | ✅ Active | Control UI via loopback |

## 7. Hooks

| Hook | Status |
|---|---|
| `boot-md` | Enabled |
| `bootstrap-extra-files` | Enabled |
| `command-logger` | Enabled |
| `session-memory` | Enabled |

## 8. Models Available

| Model | Input Cost /M | Output Cost /M | Reasoning | Context |
|---|---|---|---|---|
| DeepSeek V4 Flash | $0.14 | $0.28 | ✅ | 1M |
| DeepSeek V4 Pro | $1.74 | $3.48 | ✅ | 1M |
| DeepSeek Chat | $0.28 | $0.42 | ❌ | 131K |
| DeepSeek Reasoner | $0.28 | $0.42 | ✅ | 131K |
| Gemini 3.1 Pro | fallback | fallback | ✅ | TBD |
| Gemini 3 Flash | fallback | fallback | ✅ | TBD |

---

_End of registration document. Maintained at REGISTRY.md in the Curator workspace._
