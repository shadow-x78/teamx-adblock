<div align="center">

# TeamX - Ads Block

**Precision ad popup blocker engineered exclusively for Olympus Staff (`olympustaff.com`).**

[![Version](https://img.shields.io/badge/version-1.1.0-2563eb?style=for-the-badge&logo=semver)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-GPL--3.0-dc2626?style=for-the-badge&logo=gnu)](LICENSE)
[![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=for-the-badge&logo=googlechrome)](manifest.json)
[![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Brave%20%7C%20Edge-9333ea?style=for-the-badge&logo=googlechrome)](https://github.com/shadow-x78/TeamX-AdsBlock)
[![Auto--Update](https://img.shields.io/badge/auto--update-enabled-059669?style=for-the-badge&logo=githubactions)](docs/AUTO_UPDATE.md)

</div>

---

## Language

🇬🇧 **English** · 🇸🇦 [العربية](README_AR.md)

---

## Table of Contents

- [Overview](#overview)
- [Problem & Solution](#problem--solution)
- [Target Scope](#target-scope)
- [Features](#features)
- [Installation](#installation)
- [Automatic Background Updates](#automatic-background-updates)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TeamX - Ads Block** is an ultra-fast, zero-overhead browser extension (Manifest V3) purpose-built to stop aggressive, unwanted popups and redirect ads on `olympustaff.com`.

Unlike generic ad blockers that inject heavy DOM filter lists and slow down page rendering, **TeamX - Ads Block** hooks directly into the page's original execution environment (`world: "MAIN"`) at `document_start` to intercept malicious `window.open` trigger invocations natively before they can spawn annoying tabs or popups.

---

## Problem & Solution

| Characteristic | Generic Ad-blockers | TeamX - Ads Block |
| :--- | :--- | :--- |
| **Execution Context** | Isolated World (Late DOM injection) | **MAIN World** (`document_start`) |
| **Script Interception** | Vulnerable to inline-script evading | **100% intercept guarantee** |
| **Resource Overhead** | High (large rule sets, CPU spikes) | **Zero (single lightweight hook)** |
| **Domain Scope** | Broad / Global | **Strictly scoped to olympustaff.com** |
| **Legitimate Popups** | Often falsely blocked | **Untouched & fully functional** |

---

## Target Scope

The extension strictly activates on:
- `https://olympustaff.com/*`
- `https://*.olympustaff.com/*`

It monitors window creation calls and completely terminates any requests containing:
- `goodpics.net`
- `/go/3343952`

All other legitimate browser popups, reader tools, and navigation links execute with zero interference.

---

## Features

- ⚡ **Instant Execution**: Injected at `document_start` before page scripts initialize.
- 🛡️ **Native Interception**: Executes in the page's `MAIN` execution context to bypass inline evasion tricks.
- 🔄 **Fully Automated Updates**: Built-in Omaha protocol support enables automatic silent background updates directly from GitHub.
- 🎨 **Authentic Brand Iconography**: Custom vector-crafted brand shield designed around the official Olympus Staff TeamX identity.
- 🪶 **Zero Dependencies**: Pure, clean, lightweight vanilla JavaScript.

---

## Installation

### Option 1: Pre-packaged `.crx` (Recommended)

1. Download the latest [`TeamX-AdsBlock.crx`](https://github.com/shadow-x78/TeamX-AdsBlock/releases/latest/download/TeamX-AdsBlock.crx) from Releases.
2. Open `chrome://extensions/` in your browser.
3. Toggle **Developer mode** in the top-right corner.
4. Drag and drop the `.crx` file onto the extensions page.
5. Confirm installation.

> [!TIP]
> Extensions installed via `.crx` receive **automatic background updates** directly from this repository without requiring any manual action!

### Option 2: Load Unpacked Source (For Developers)

```bash
git clone https://github.com/shadow-x78/TeamX-AdsBlock.git
```

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the cloned directory.

---

## Automatic Background Updates

This extension integrates Google's official **Autoupdate Protocol**:

- **Manifest Declaration**: Points to the repository's [`updates.xml`](updates.xml).
- **Silent Background Checks**: Your browser periodically polls GitHub raw content in the background.
- **Zero-Touch Upgrades**: When a new version is released, Chrome pulls the signed `.crx`, verifies cryptographic signatures, and seamlessly updates the extension with zero user interaction needed.

For architectural and release details, read the [Auto-Update Documentation](docs/AUTO_UPDATE.md).

---

## Project Structure

```text
TeamX-AdsBlock/
├── .github/
│   └── workflows/
│       └── release.yml          # Automated CI/CD release & CRX builder
├── docs/
│   ├── ARCHITECTURE.md          # Technical design & hook lifecycle
│   ├── AUTO_UPDATE.md           # Omaha protocol & auto-update pipeline
│   └── INSTALLATION.md          # Step-by-step installation instructions
├── icons/
│   ├── icon16.png               # Browser toolbar & favicon size
│   ├── icon32.png               # Retina resolution display
│   ├── icon48.png               # Extension manager view
│   ├── icon128.png              # High-res store & install display
│   └── icon512.png              # Master high-resolution asset
├── content.js                   # Interception logic (MAIN execution world)
├── manifest.json                # Manifest V3 extension configuration
├── updates.xml                  # Chrome Autoupdate protocol manifest
├── CHANGELOG.md                 # Semantic versioning release log
├── CONTRIBUTING.md              # Guidelines for contributors
├── LICENSE                      # GNU General Public License v3.0
├── README.md                    # English documentation
├── README_AR.md                 # Arabic documentation
└── SECURITY.md                  # Security and vulnerability reporting
```

---

## Documentation

| Document | Description |
| :--- | :--- |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical execution flow, MAIN world mechanics, and popup interception |
| [AUTO_UPDATE.md](docs/AUTO_UPDATE.md) | Google Omaha autoupdate protocol, cryptographic signing, and release workflow |
| [INSTALLATION.md](docs/INSTALLATION.md) | Multi-browser installation steps and verification procedures |

---

## Contributing

1. Fork the repository and create your branch (`feature/xyz`, `fix/xyz`).
2. Maintain strict zero-dependency vanilla JavaScript standards.
3. Test compatibility directly against `olympustaff.com`.
4. Submit a Pull Request.

Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](SECURITY.md).

---

## License

Distributed under the [GPL-3.0 License](LICENSE).

---

<div align="center">

Built by [shadow-x78](https://github.com/shadow-x78) · [Changelog](CHANGELOG.md) · [Security](SECURITY.md)

© 2026 TeamX - Ads Block

</div>
