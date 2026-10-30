<div align="center">

# Installation Guide - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.1.0-2563eb?style=flat-square&logo=semver)](../CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](../LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=flat-square&logo=googlechrome)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Method 1: Pre-packaged CRX](#method-1-crx)
- [Method 2: Load Unpacked Source](#method-2-unpacked)
- [Browser Compatibility](#browser-compatibility)

---

<a id="overview"></a>
## Overview

You can install **TeamX - AdBlock** using either the pre-packaged CRX file (which supports silent background auto-updates) or as an unpacked developer extension.

---

<a id="method-1-crx"></a>
## Method 1: Pre-packaged `.crx` (Recommended for Users)

Installing via the `.crx` binary connects the extension to the automated update pipeline:

1. Download the latest `TeamX-AdBlock.crx` from the [Releases](https://github.com/shadow-x78/teamx-adblock/releases) page.
2. Open Google Chrome (or Brave, Edge, Chromium) and navigate to:
   ```text
   chrome://extensions/
   ```
3. Enable **Developer mode** via the toggle switch in the top-right corner.
4. Drag and drop the downloaded `TeamX-AdBlock.crx` file into the extensions tab.
5. Click **Add extension** when prompted.

> [!NOTE]
> Once installed this way, your browser will periodically check for and install newer versions automatically without requiring any manual updates!

---

<a id="method-2-unpacked"></a>
## Method 2: Load Unpacked (For Developers)

1. Clone or download the source code:
   ```bash
   git clone https://github.com/shadow-x78/teamx-adblock.git
   ```
2. Open `chrome://extensions/` with **Developer mode** enabled.
3. Click the **Load unpacked** button.
4. Select the cloned `teamx-adblock` directory.
5. The extension is now active.

---

<a id="browser-compatibility"></a>
## Browser Compatibility

| Browser | Supported | Auto-Updates |
| :--- | :---: | :---: |
| **Google Chrome** | ✅ | ✅ Supported via Omaha protocol |
| **Brave Browser** | ✅ | ✅ Supported |
| **Microsoft Edge** | ✅ | ✅ Supported |
| **Chromium** | ✅ | ✅ Supported |
| **Vivaldi** | ✅ | ✅ Supported |

---

<div align="center">

Built by <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[Changelog](../CHANGELOG.md) ·
[Security](../SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>
