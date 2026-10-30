<div align="center">

# Contributing to TeamX - Ads Block

[![Version](https://img.shields.io/badge/version-1.1.0-2563eb?style=flat-square&logo=semver)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=flat-square&logo=googlechrome)

</div>

---

## Table of Contents

- [Contributing to TeamX - Ads Block](#contributing-to-teamx---ads-block)
- [Day-to-Day Work](#day-to-day-work)
- [Release Process (maintainers)](#release-process-maintainers)
- [Verification Checklist](#verification-checklist)

---

Contributions to TeamX - Ads Block are welcome. Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

<a id="day-to-day-work"></a>
## Day-to-Day Work

- **Branches:** `feature/`, `fix/`, `docs/`, `chore/` prefixes (e.g. `feature/block-new-redirect`), branched from `main`.
- **Commits:** `teamx-adsblock | <type>: <description>` for work, `teamx-adsblock | vX.Y.Z | <type>: <description>` for release commits. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **Style:** Pure, zero-dependency vanilla JavaScript. Every file header follows the TeamX - Ads Block style:

```javascript
// TeamX - Ads Block (MIT)
// https://github.com/shadow-x78/teamx-adsblock
```

- **Pull requests:** from a fork, targeting `main`, with tests verified on `olympustaff.com`, a `CHANGELOG.md` entry, and clean commit logs.

<a id="release-process-maintainers"></a>
## Release Process (maintainers)

1. Bump version in `manifest.json` and `updates.xml`.
2. Update `CHANGELOG.md` with semantic version entry.
3. Pack the signed `.crx` bundle using the private signing key:
   ```bash
   google-chrome --pack-extension=. --pack-extension-key=../TeamX-AdsBlock.pem
   ```
4. Commit as `teamx-adsblock | vX.Y.Z | release: <summary>` and tag `vX.Y.Z`.
5. Create a GitHub Release with the tag and upload the built `.crx` and `.zip`.

<a id="verification-checklist"></a>
## Verification Checklist

- [ ] Target domain scope strictly matches `olympustaff.com`.
- [ ] Injected at `document_start` in `MAIN` execution world.
- [ ] Known malicious ad popup domains (`goodpics.net`, `/go/3343952`) are fully suppressed.
- [ ] Safe `window.open` calls execute without side-effects.
- [ ] Icons and manifest syntax validate cleanly without browser console warnings.

---

<div align="center">

Built by <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[Changelog](CHANGELOG.md) ·
[Security](SECURITY.md)

<sub>&copy; 2026 TeamX - Ads Block</sub>

</div>
