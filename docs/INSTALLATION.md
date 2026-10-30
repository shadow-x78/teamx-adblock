# Installation Guide

You can install **TeamX - Ads Block** using either the pre-packaged CRX file (which supports silent background auto-updates) or as an unpacked developer extension.

---

## Method 1: Pre-packaged `.crx` (Recommended for Users)

Installing via the `.crx` binary connects the extension to the automated update pipeline:

1. Download the latest `TeamX-AdsBlock.crx` from the [Releases](https://github.com/shadow-x78/TeamX-AdsBlock/releases) page.
2. Open Google Chrome (or Brave, Edge, Chromium) and navigate to:
   ```text
   chrome://extensions/
   ```
3. Enable **Developer mode** via the toggle switch in the top-right corner.
4. Drag and drop the downloaded `TeamX-AdsBlock.crx` file into the extensions tab.
5. Click **Add extension** when prompted.

> [!NOTE]
> Once installed this way, your browser will periodically check for and install newer versions automatically without requiring any manual updates!

---

## Method 2: Load Unpacked (For Developers)

1. Clone or download the source code:
   ```bash
   git clone https://github.com/shadow-x78/TeamX-AdsBlock.git
   ```
2. Open `chrome://extensions/` with **Developer mode** enabled.
3. Click the **Load unpacked** button.
4. Select the cloned `TeamX-AdsBlock` directory.
5. The extension is now active.
