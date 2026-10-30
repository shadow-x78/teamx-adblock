<div align="center">

# Architecture - TeamX - AdBlock

[![Version](https://img.shields.io/badge/version-1.3.0-2563eb?style=flat-square&logo=semver)](../CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-dc2626?style=flat-square)](../LICENSE)
![Manifest](https://img.shields.io/badge/manifest-v3-16a34a?style=flat-square&logo=googlechrome)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Chromium-9333ea?style=flat-square&logo=googlechrome)

</div>

---

## Language

<a href="ARCHITECTURE.md">🇬🇧 English</a> · <a href="ARCHITECTURE_AR.md">🇸🇦 العربية</a>

---

## Table of Contents

- [Overview](#overview)
- [Execution Context](#execution-context)
- [Interception Mechanics](#interception-mechanics)
- [Performance & Security](#performance--security)

---

<a id="overview"></a>
## Overview

`TeamX - AdBlock` operates a multi-layered defense architecture specifically optimized for `olympustaff.com` to eliminate all ads, popups, and anti-adblock modals:

```mermaid
flowchart TD
    A[Browser navigates to olympustaff.com] --> B[declarativeNetRequest blocks ad network requests]
    A --> C[rules.css immediately collapses ad DOM elements]
    A --> D[content.js loads at document_start in MAIN world]
    D --> E[Stub window.aclib with immutable Proxy]
    D --> F[Hook window.open to suppress ad popups]
    D --> G[Hook addEventListener to drop click-hijacking listeners]
    D --> H[Hook eval & Image to bypass anti-adblock probes]
    D --> I[MutationObserver purges dynamic ad containers]
```

---

<a id="execution-context"></a>
## Execution Context

Most traditional adblockers inject scripts into an **Isolated World** (the default execution environment for extension content scripts). However, inline scripts executing in the page's original context (`MAIN` world) cannot be directly intercepted if they define or cache global functions before the isolated world can attach listeners.

By declaring:
```json
"world": "MAIN",
"run_at": "document_start"
```
the extension guarantees that its wrapper runs before any inline scripts or external trackers on the host page have initialized, securing total interception fidelity.

---

<a id="interception-mechanics"></a>
## Interception Mechanics

```javascript
// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock

(() => {
  const originalOpen = window.open;

  window.open = function (url) {
    if (url && (String(url).includes("goodpics.net") || String(url).includes("/go/3343952"))) {
      return null;
    }
    return originalOpen.apply(this, arguments);
  };
})();
```

- **Clean passthrough**: `arguments` and `this` context are faithfully preserved.
- **Strict suppression**: Blacklisted domains immediately return `null` and terminate the popup lifecycle.

---

<a id="performance--security"></a>
## Performance & Security

- Zero CPU overhead while browsing or reading manga chapters.
- No network requests, telemetry, or third-party analytic pings.
- Native Chrome sandbox isolation for local script safety.

---

<div align="center">

Built by <a href="https://github.com/shadow-x78">shadow-x78</a> ·
[Changelog](../CHANGELOG.md) ·
[Security](../SECURITY.md)

<sub>&copy; 2026 TeamX - AdBlock</sub>

</div>
