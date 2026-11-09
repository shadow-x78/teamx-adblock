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

### Security
- **Signing Key Isolation:** The CRX signing key is now explicitly excluded by name and by extension (`.pem`, `.key`, `.p12`, `.pfx`), the release workflow fails when a key file becomes tracked, and the key is purged from the runner even when packing fails.
- **Popup Allowlist Hardening:** `window.open` destinations are trusted only when the hostname is exactly `olympustaff.com` or a subdomain of it, so look-alike hosts such as `fakeolympustaff.com` can no longer pass the check.

### Fixed
- **Popup Blocking Regression:** The page-context copy of the defenses no longer throws `ReferenceError: isTargetAd is not defined`, which previously broke every legitimate `window.open` call on the site.
- **Over-Blocking of Legitimate Links:** The generic `bet` and `casino` substring checks were replaced with hostname-scoped ad-network matching, so URLs such as `alphabet.com`, `webster.com`, `/bets/reading`, or `?x=bet` are no longer cancelled.
- **Firefox Update Channel:** Firefox now reads the Omaha manifest from `browser_specific_settings.gecko.update_url`, so `.xpi` users receive automatic updates again.
- **Firefox Minimum Version:** `strict_min_version` raised from `109.0` to `140.0`, matching the versions actually required by declarative net request (113), the MAIN execution world (128), and the Firefox data-collection declaration (140).
- **Firefox Submission Metadata:** Added `browser_specific_settings.gecko.data_collection_permissions` declaring that no data is collected.

### Changed
- **Inline Video Players:** The walkthroughs now play directly inside `README.md`, `README_AR.md`, `docs/INSTALLATION.md`, and `docs/INSTALLATION_AR.md` through GitHub-hosted asset URLs, because GitHub removes `<video>` elements that point at files inside a repository.
- **Network Layer Coverage:** `propellerads.com`, `monetag.com`, `adsterra.com`, and `popads.net` are now blocked declaratively, matching the JavaScript heuristics.
- **DOM Purge Performance:** Mutation observer callbacks are coalesced into a single animation frame and the per-element text scan runs only when the page shows the anti-adblock notice.
- **Diagnostics:** Swallowed hook failures are reported when `window.__TEAMX_DEBUG__` is enabled, and the `Image` constructor keeps its prototype and static members.

### Documentation
- Refreshed version badges, the supported-versions table, the commit guidance, and the interception examples in `docs/ARCHITECTURE.md` and `docs/ARCHITECTURE_AR.md`.

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
