<div align="center">

# Changelog - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.3.0-2563eb?style=flat-square&logo=semver)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=flat-square&logo=googlechrome)

</div>

---

All notable changes to **TeamX - AdBlock** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Video Tutorial Guide:** New `docs/VIDEO_TUTORIAL.md` and `docs/VIDEO_TUTORIAL_AR.md` documenting playback options, media specifications, and the per-platform chapter breakdown of both recordings.
- **Tutorial Poster Frames:** Added `assets/videos/TeamX_AdBlock_Tutorial_EN_poster.jpg` and `assets/videos/TeamX_AdBlock_Tutorial_AR_poster.jpg` as clickable poster frames for the walkthroughs.

### Changed
- **Visible Video Tutorial:** Replaced the raw `<video>` tags, which GitHub removes from rendered Markdown, with poster-frame players that open the H.264 walkthroughs in the browser across `README.md`, `README_AR.md`, `docs/INSTALLATION.md`, and `docs/INSTALLATION_AR.md`.

---

## [1.3.0] - 2026-10-31

### Added
- **Comprehensive Ad & Popup Blocking:** Multi-layered engine stopping all in-page banners, popunders, and redirect popups on `olympustaff.com`.
- **Declarative Net Request Engine:** `rules.json` blocking ad network assets (`acscdn.com`, `teethesmitsvah.com`, `blockadsnot.com`, `cnejpkmvsjvft.com`, `odpktokz.com`, `goodpics.net`).
- **Cosmetic CSS Elimination:** `rules.css` immediately hiding `#fixedban`, `.body-top-ads`, `.body-bottom-ads`, and `.c-ads` without visual layout shift.
- **Pre-emptive Script & Global Neutering:** Read-only immutable proxy for `window.aclib` and defusal of the obfuscated popunder trigger.
- **Click-Hijacking Prevention:** Interception of `EventTarget.prototype.addEventListener` preventing ad redirect listeners from binding.
- **Anti-AdBlock Detection Bypass:** Silent defusal of BlockAdBlock / AdBlock Notice scripts in `window.eval` and fake ad image probes.
- **Continuous DOM Cleanup:** Active `MutationObserver` purging dynamically injected ad wrappers and collapsed whitespace gaps.

---

## [1.2.0] - 2026-10-30

### Changed
- Rebranded official repository and project to `teamx-adblock` / `TeamX - AdBlock`.
- Switched licensing to the permissive **MIT License**.
- Redesigned and geometrically fitted brand shield (`Cyber Hex-Shield`) matching Olympus Staff's TeamX eagle proportions.
- Refactored documentation banners with compact typographic lockups and Pango Arabic text rendering.
- Added comprehensive Arabic documentation suite (`docs/ARCHITECTURE_AR.md`, `docs/AUTO_UPDATE_AR.md`, `docs/INSTALLATION_AR.md`).
- Standardized git commit conventions to `teamx-adblock | <type>: <description>`.

---

## [1.1.0] - 2026-10-30

### Added
- Complete Manifest V3 architecture with `world: "MAIN"` and `run_at: "document_start"`.
- Targeted suppression of unwanted redirects and ad popups (`goodpics.net`, `/go/3343952`).
- Safe passthrough for all legitimate `window.open` invocation calls.
- Custom vector-crafted brand iconography tailored for Olympus Staff (`olympustaff.com`).
- Automatic updates protocol configuration via `update_url` and `updates.xml`.
- GitHub Actions automated packaging workflow for CRX generation and releases.

---

<div align="center">

Built by <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[Changelog](CHANGELOG.md) ·
[Security](SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>
