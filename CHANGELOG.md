<div align="center">

# Changelog - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.4.0-2563eb?style=flat-square&logo=semver)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=flat-square&logo=googlechrome)

</div>

---

All notable changes to **TeamX - AdBlock** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.0] - 2026-11-17

### Added
- **Popup Panel:** Clicking the toolbar icon opens a panel with a protection switch, the blocked-ad counter (total and today), a language switch, a link to the GitHub repository, the copyright line, and the running version.
- **Arabic / English Switch:** The popup ships with both languages. Choosing one sets `document.documentElement.lang` and `dir`, rewrites every label, flips the switch travel direction for the new writing direction, and stores the choice as `lang` in `chrome.storage.local`, so the panel reopens in the same language.
- **Single Center Axis:** The popup is one centered column: the mark, name, status, counter, protection switch, language switch, repository button, and legal lines all share the same width and center line, so nothing sits on a different edge.
- **Blocked-Ad Counter:** Every ad element removed by the DOM layer is counted. Totals live in `chrome.storage.local` (`blockedTotal`, `blockedToday`, `blockedDay`) so they survive reloads and restart on a new day.
- **Live On/Off Switch:** The popup writes `enabled` to storage, enables or disables the declarative ruleset, and reloads open site tabs so the page-context defenses are installed or removed immediately.

### Fixed
- **Page Wipe (Content Blocking):** The DOM layer removed every `div`/`section` whose `innerText` contained the anti-adblock notice. Because an ancestor's `innerText` includes its descendants' text, every container between `body` and the notice was deleted, leaving a blank page — the reported "content blocked" symptom. The notice is now removed by targeting the blocking overlay itself (full-screen, high `z-index`, carries the notice, holds no page media); ancestors are never touched.
- **Anti-AdBlock Detection Never Fires:** The site's blocker paints a 468x60 probe off-screen and flags a violation when `clientHeight`/`clientWidth` read back as `0`. Cosmetic rules that clipped the probe — or any browser reporting `0` for a clipped/offscreen box — let detection wipe the page. `clientHeight`/`clientWidth` now report the probe's intended size (cached per element so layout reads stay cheap), while every other element keeps its native metrics.
- **Body Wipe Guard:** `Element.prototype.innerHTML`, `Node.prototype.textContent`, and `Element.prototype.replaceChildren` refuse to blank `document.body`/`document.documentElement`, so the page keeps its content even if detection fires.
- **`aclib` Hook Crashes:** Installed unconditionally before, it threw `TypeError: aclib.runBanner is not a function` in the isolated world and `Cannot redefine property: aclib` when the site had already defined it; the second failure aborted the rest of `applyDefenses`. It is now an accessor that the site's loader cannot replace, `runBanner` is a silent no-op, and each defense runs in its own `try/catch`.
- **Site Controls Not Responding:** The `addEventListener` guard cancelled any click/pointer listener whose source mentioned `aclib`, which matched the site's own bundle and dropped working controls. It now matches narrow ad fingerprints only (`goodpics.net`, `/go/3343952`, `lastOpened`, `intervalSeconds`, `teethesmitsvah`).
- **Content Hidden by Cosmetic Rules:** Generic attribute selectors hid anything carrying inline `z-index: 999999`/`99999`, which the site now also uses for real modals and the reader. Those selectors and the `:has()`-based empty-wrapper rule are gone; `#fixedban`, ad containers, and ad iframes are still hidden by ID/class.
- **Image Hook Safety:** `new Image()` no longer throws `Cannot redefine property: src` on pages that already lock the `src` property; the hook falls back to intercepting `setAttribute`, so site images keep loading.
- **Popup Blocking Regression:** The page-context copy of the defenses no longer throws `ReferenceError: isTargetAd is not defined`, which previously broke every legitimate `window.open` call on the site.
- **Over-Blocking of Legitimate Links:** The generic `bet` and `casino` substring checks were replaced with hostname-scoped ad-network matching, so URLs such as `alphabet.com`, `webster.com`, `/bets/reading`, or `?x=bet` are no longer cancelled.
- **Firefox Update Channel:** Firefox now reads the Omaha manifest from `browser_specific_settings.gecko.update_url`, so `.xpi` users receive automatic updates again.
- **Firefox Minimum Version:** `strict_min_version` raised from `109.0` to `140.0`, matching the versions actually required by declarative net request (113), the MAIN execution world (128), and the Firefox data-collection declaration (140).
- **Firefox Submission Metadata:** Added `browser_specific_settings.gecko.data_collection_permissions` declaring that no data is collected.

### Changed
- **Isolated-World Bridge:** A new `bridge.js` content script publishes the stored on/off state on `<html data-teamx-enabled>` (the MAIN-world script cannot use `chrome.*`), applies the cosmetic stylesheet only while enabled, and batches blocked-ad deltas into storage.
- **Toggle-Aware Styling:** `rules.css` selectors are scoped with `:root:not([data-teamx-enabled="0"])`, so switching the extension off restores ads without any stylesheet churn. The attribute defaults to absent, so ads are hidden from the first paint.
- **Defense Ordering:** Page-context defenses install once per window (`__TEAMX_DEFENSES__`), each isolated in a `step()` wrapper, and the page-context copy is injected after the isolated-world install so a failure in one cannot disable the other.
- **Page Restoration:** `body` visibility/display/overflow locks applied by the blocker are reverted after the overlay is removed, so the page is interactive again.
- **Inline Video Players:** The walkthroughs now play directly inside `README.md`, `README_AR.md`, `docs/INSTALLATION.md`, and `docs/INSTALLATION_AR.md` through GitHub-hosted asset URLs, because GitHub removes `<video>` elements that point at files inside a repository.
- **Network Layer Coverage:** `propellerads.com`, `monetag.com`, `adsterra.com`, and `popads.net` are now blocked declaratively, matching the JavaScript heuristics.
- **DOM Purge Performance:** Mutation observer callbacks coalesce into a single animation frame, and the ad-wrapper scan is scoped to structure instead of walking page text on every mutation.
- **Diagnostics:** Swallowed hook failures are reported when `window.__TEAMX_DEBUG__` is enabled, and the `Image` constructor keeps its prototype and static members.

### Security
- **Signing Key Isolation:** The CRX signing key is now explicitly excluded by name and by extension (`.pem`, `.key`, `.p12`, `.pfx`), the release workflow fails when a key file becomes tracked, and the key is purged from the runner even when packing fails.
- **Popup Allowlist Hardening:** `window.open` destinations are trusted only when the hostname is exactly `olympustaff.com` or a subdomain of it, so look-alike hosts such as `fakeolympustaff.com` can no longer pass the check.

### Documentation
- Refreshed version badges, the supported-versions table, the commit guidance, and the interception examples in `docs/ARCHITECTURE.md` and `docs/ARCHITECTURE_AR.md`.

### Audit & Cleanup
- **CRX Release Step:** The signing step could never run because a step `if` cannot read that step's own `env`; the secret stays scoped to the single step and the script now decides whether to sign.
- **Popup Switch Recovery:** A rejected `chrome.storage.local.set` left the protection switch disabled with no way to interact; the handler now releases it in a `finally`.
- **Generated Ruleset Cache:** Chrome's `_metadata/generated_indexed_rulesets/` is ignored, so runtime output can no longer be committed.
- **Comment Cleanup:** Source comments were reduced to the documented two-line attribution header, and the configuration files follow the project `─` header and section style.
- **Documentation:** Version badges, the auto-update examples, and both README project trees now match the shipped package.

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
