# Fedora Security Hardening Standards

Reference guide for the `fedora-auto-update` skill. Use this when evaluating
or remediating security posture.

## Minimum Viable Perimeter

These are the non-negotiable checks enforced by `security-audit.sh`:

| Check            | Expected State      | Why It Matters                                     |
|------------------|---------------------|---------------------------------------------------|
| firewalld        | active, zone=drop   | Default deny — only explicitly opened ports pass  |
| SELinux          | Enforcing           | Mandatory access control contains breaches         |
| SSH root login   | no / prohibit-pass  | Prevents direct root brute-force                   |
| SSH password auth| no                  | Keys only — eliminates credential stuffing         |
| Listening ports  | known services only | Reduces attack surface                             |

## Strongly Recommended (not mandatory)

| Service   | Purpose                                          |
|-----------|--------------------------------------------------|
| fail2ban  | Rate-limit SSH and other auth attempts            |
| auditd    | Log security-relevant events for forensics        |
| `dnf-automatic` | Apply security errata between full update runs |

## Firewalld Zone Strategy

- **`drop`** — default zone (reject all inbound unless explicitly allowed)
- Open services example:
  ```bash
  firewall-cmd --permanent --add-service=ssh
  firewall-cmd --permanent --add-service=https
  firewall-cmd --reload
  ```

## SELinux

- Verify: `getenforce` → should be **Enforcing**
- Config: `/etc/selinux/config` — `SELINUX=enforcing`
- Troubleshoot denials: `ausearch -m avc -ts recent`
- Set booleans: `setsebool -P <name> on`

## SSH Hardening Checklist

- `PermitRootLogin prohibit-password`
- `PasswordAuthentication no`
- `PubkeyAuthentication yes`
- `MaxAuthTries 3`
- `ClientAliveInterval 300`
- `ClientAliveCountMax 0`

## Kernel Live Patching (optional)

Avoids some reboots after kernel CVEs:

```bash
dnf install -y kpatch
systemctl enable --now kpatch.service
```

**Note:** Major kernel version upgrades (e.g., 6.13 → 6.14) still require a reboot.
Live patching only covers selective CVEs on the running kernel.
