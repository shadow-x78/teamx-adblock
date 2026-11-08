<div align="center">

# Installation Guide - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.3.0-2563eb?style=flat-square&logo=semver)](../CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](../LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Firefox%20%7C%20Brave%20%7C%20Edge-9333ea?style=flat-square&logo=googlechrome)

</div>

---

## Language

<a href="INSTALLATION.md">🇬🇧 English</a> · <a href="INSTALLATION_AR.md">🇸🇦 العربية</a>

---

## Table of Contents

- [Overview](#overview)
- [Video Setup Walkthrough](#video-walkthrough)
- [Chromium Browsers (Chrome, Brave, Edge, Opera)](#chromium-browsers)
- [Android Devices (Kiwi Browser)](#android-kiwi)
- [Mozilla Firefox](#mozilla-firefox)
- [Load Unpacked Source](#load-unpacked)
- [Browser Compatibility Matrix](#browser-compatibility)

---

<a id="overview"></a>
## Overview

You can install **TeamX - AdBlock** across all modern Chromium and Gecko (Firefox) browsers using pre-packaged extension binaries or from source.

---

<a id="video-walkthrough"></a>
## Video Setup Walkthrough

<video src="https://github.com/user-attachments/assets/275fd7df-f6fc-42b6-a293-3d121013b46d" poster="../assets/videos/TeamX_AdBlock_Tutorial_EN_poster.jpg" controls width="100%" style="max-width: 100%;">
  <p>Your browser does not support embedded HTML5 video. You can <a href="https://raw.githubusercontent.com/shadow-x78/teamx-adblock/main/assets/videos/TeamX_AdBlock_Tutorial_EN.mp4">view or download the video directly</a>.</p>
</video>

▶ **Watch the English walkthrough** — 1920×1080 · H.264/AAC · 00:52 · [Download MP4](https://raw.githubusercontent.com/shadow-x78/teamx-adblock/main/assets/videos/TeamX_AdBlock_Tutorial_EN.mp4) · [🇸🇦 النسخة العربية](INSTALLATION_AR.md#فيديو-الشرح)

> [!NOTE]
> The inline player is served from GitHub's asset store, while the same recording stays versioned inside `assets/videos/` in this repository.

---

<a id="chromium-browsers"></a>
## Chromium Browsers (Chrome, Brave, Edge, Opera)

1. Download [`TeamX-AdBlock.crx`](https://github.com/shadow-x78/teamx-adblock/releases/latest/download/TeamX-AdBlock.crx) from [Releases](https://github.com/shadow-x78/teamx-adblock/releases).
2. Open `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`).
3. Enable **Developer mode** toggle in the top-right corner.
4. Drag and drop `TeamX-AdBlock.crx` into the extensions page.
5. Confirm installation.

> [!NOTE]
> CRX installations receive automatic silent background updates directly from GitHub.

---

<a id="android-kiwi"></a>
## Android Devices (Kiwi Browser)

To block popups on Android mobile devices:

1. Download and install **Kiwi Browser** from the [Google Play Store](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser).
2. Download [`TeamX-AdBlock.crx`](https://github.com/shadow-x78/teamx-adblock/releases/latest/download/TeamX-AdBlock.crx) to your device.
3. Open Kiwi Browser and navigate to `kiwi://extensions`.
4. Turn on the **Developer mode** toggle switch.
5. Tap **+(from .zip/.crx/.user.js)** button.
6. Select `TeamX-AdBlock.crx` from your Downloads folder to activate.

---

<a id="mozilla-firefox"></a>
## Mozilla Firefox

### Option A: Temporary Add-on (Standard Firefox)
1. Download [`TeamX-AdBlock.xpi`](https://github.com/shadow-x78/teamx-adblock/releases/latest/download/TeamX-AdBlock.xpi) or clone the repository.
2. In Firefox address bar, navigate to:
   ```text
   about:debugging#/runtime/this-firefox
   ```
3. Click **Load Temporary Add-on...**.
4. Select `manifest.json` from the repository folder (or the downloaded `.xpi` file).
5. The extension activates immediately.

### Option B: Permanent Installation (Firefox Developer Edition / Nightly)
1. Open `about:config` and set `xpinstall.signatures.required` to `false`.
2. Drag and drop `TeamX-AdBlock.xpi` into any Firefox tab and click **Add**.

---

<a id="load-unpacked"></a>
## Load Unpacked Source (For Developers)

```bash
git clone https://github.com/shadow-x78/teamx-adblock.git
```
- **Chrome / Brave / Edge:** In `chrome://extensions/`, click **Load unpacked** and select `teamx-adblock`.
- **Firefox:** In `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on** and select `teamx-adblock/manifest.json`.

---

<a id="browser-compatibility"></a>
## Browser Compatibility Matrix

| Browser | Supported Engine | Auto-Updates | Package Format |
| :--- | :---: | :---: | :---: |
| **Google Chrome** | Chromium 111+ | ✅ Omaha Protocol | `.crx` |
| **Brave Browser** | Chromium 111+ | ✅ Supported | `.crx` |
| **Microsoft Edge** | Chromium 111+ | ✅ Supported | `.crx` |
| **Mozilla Firefox** | Gecko 109+ | ✅ WebExtensions | `.xpi` |
| **Opera / Vivaldi** | Chromium 111+ | ✅ Supported | `.crx` |

---

<div align="center">

Built by <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[Changelog](../CHANGELOG.md) ·
[Security](../SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>
