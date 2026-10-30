# Changelog

All notable changes to **TeamX - Ads Block** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-30

### Added
- Complete Manifest V3 architecture with `world: "MAIN"` and `run_at: "document_start"`.
- Targeted suppression of unwanted redirects and ad popups (`goodpics.net`, `/go/3343952`).
- Safe passthrough for all legitimate `window.open` invocation calls.
- Custom vector-crafted brand iconography tailored for Olympus Staff (`olympustaff.com`).
- Automatic updates protocol configuration via `update_url` and `updates.xml`.
- GitHub Actions automated packaging workflow for CRX generation and releases.
