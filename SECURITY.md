<div align="center">

# Security Policy - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.3.0-2563eb?style=flat-square&logo=semver)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=flat-square&logo=googlechrome)

</div>

---

## Table of Contents

- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting)
- [Disclosure Policy](#disclosure)
- [Trust Boundaries](#trust-boundaries)

---

<a id="supported-versions"></a>
## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.3.x   | :white_check_mark: |
| 1.2.x   | :white_check_mark: |
| < 1.2.0 | :x: |

---

<a id="reporting"></a>
## Reporting a Vulnerability

If you discover a security vulnerability or ad popup interception bypass in **TeamX - AdBlock**, please report it responsibly:

- Open a private security advisory through GitHub: [Security Advisories](https://github.com/shadow-x78/teamx-adblock/security/advisories)
- Or contact the maintainer directly through GitHub.

Please include:
1. Steps to reproduce the bypass on `olympustaff.com`.
2. Browser version and environment details.
3. Any scripts or network payloads triggering the popup.

---

<a id="disclosure"></a>
## Disclosure Policy

- Security reports receive an initial response within 48 hours.
- A fix will be developed in a private branch, verified, and distributed via an automated patch release.
- Public disclosure occurs only after an update has been released to all users.

---

<a id="trust-boundaries"></a>
## Trust Boundaries

- **Execution Context:** The extension runs in `MAIN` world at `document_start` to intercept `window.open`. It does not store user data, transmit network telemetry, or inspect credentials.
- **Auto-Updates:** Chromium verifies every `.crx` update against the extension's public key; the extension ID `cnefeiflkeegmadihlfffchlmnmfedmd` is derived from that key, so a package signed with a different key is rejected. The Firefox package updates through `browser_specific_settings.gecko.update_url` and must carry a valid Mozilla signature when distributed through AMO.

---

<div align="center">

Built by <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[Changelog](CHANGELOG.md) ·
[Security](SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>
