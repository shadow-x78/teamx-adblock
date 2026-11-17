# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.4.1] - 2026-11-17

### Changed
- chore: publish releases the way the reference project does. The workflow
  extracts the notes for the tag from this file, writes a `.sha256` next to each
  asset, titles the release `TeamX - AdBlock vX.Y.Z`, and no longer asks GitHub to
  generate its own notes.
- docs: rewrite this file in the Keep a Changelog form used by the reference
  project, with one `## [vX.Y.Z]` heading per release and `feat:`/`fix:`/`chore:`
  bullets, and switch every documentation badge from `flat-square` to
  `for-the-badge`.
- Version bumped to 1.4.1 across `manifest.json`, `updates.xml`, and the
  documentation badges.

## [v1.4.0] - 2026-11-17

### Added
- feat: add a toolbar popup with a protection switch, the blocked-ad counter for
  today and all time, an Arabic/English switch, a repository link, the copyright
  line, and the running version. The panel is one centered column, so every block
  shares the same width and center line in both writing directions.
- feat: persist the language as `lang` and the protection state as `enabled` in
  `chrome.storage.local`, so the panel reopens with the same choice after a
  restart.
- feat: count every ad element the DOM layer removes and keep the totals in
  `blockedTotal`, `blockedToday`, and `blockedDay`, so the number survives reloads
  and restarts on a new day.
- feat: make the protection switch live. It writes the stored state, enables or
  disables the declarative ruleset, and reloads open site tabs so the page-context
  defenses are installed or removed immediately.

### Fixed
- fix: stop the extension from deleting the page it is meant to protect. The DOM
  layer removed every `div`/`section` whose `innerText` contained the anti-adblock
  notice, and because an ancestor's `innerText` includes its descendants' text,
  every container between `body` and the notice was deleted, leaving a blank page.
  The notice is now removed by targeting the blocking overlay itself, and ancestors
  are never touched.
- fix: keep the site's anti-adblock probe from reporting a violation. The blocker
  paints a 468x60 box off-screen and wipes the page when `clientHeight` or
  `clientWidth` read back as `0`, which any cosmetic rule that clipped the box
  caused. Those two metrics now report the probe's intended size, cached per
  element so layout reads stay cheap, while every other element keeps its native
  metrics.
- fix: refuse to blank `document.body` or `document.documentElement`. The
  `innerHTML`, `textContent`, and `replaceChildren` hooks reject a wipe, so the
  page keeps its content even if detection fires.
- fix: stop the `aclib` hook from crashing. It threw
  `TypeError: aclib.runBanner is not a function` in the isolated world and
  `Cannot redefine property: aclib` when the site had already defined it, and the
  second failure aborted the remaining defenses. It is now an accessor the site's
  loader cannot replace, `runBanner` is a silent no-op, and each defense runs in
  its own `try/catch`.
- fix: stop the click guard from cancelling the site's own controls. It dropped any
  click or pointer listener whose source mentioned `aclib`, which matched the
  site's bundle; it now matches narrow ad fingerprints only (`goodpics.net`,
  `/go/3343952`, `lastOpened`, `intervalSeconds`, `teethesmitsvah`).
- fix: stop the cosmetic rules from hiding real content. Generic selectors hid
  anything carrying an inline `z-index: 999999` or `99999`, which the site now also
  uses for modals and the reader; those selectors and the `:has()` empty-wrapper
  rule are gone, and `#fixedban`, ad containers, and ad iframes are still hidden by
  ID and class.
- fix: keep site images loading. `new Image()` no longer throws
  `Cannot redefine property: src` on pages that lock the property, and the hook
  falls back to intercepting `setAttribute`.
- fix: restore legitimate `window.open` calls. The page-context copy of the
  defenses no longer throws `ReferenceError: isTargetAd is not defined`, which
  broke every popup the site opened itself.
- fix: stop over-blocking ordinary links. The generic `bet` and `casino` substring
  checks were replaced with hostname-scoped ad-network matching, so URLs such as
  `alphabet.com`, `webster.com`, `/bets/reading`, or `?x=bet` are no longer
  cancelled.
- fix: restore the Firefox update channel by reading the Omaha manifest from
  `browser_specific_settings.gecko.update_url`, so `.xpi` users receive automatic
  updates again.
- fix: raise the Firefox minimum version from `109.0` to `140.0`, matching what
  declarative net request (113), the MAIN execution world (128), and the
  data-collection declaration (140) actually require.
- fix: declare `browser_specific_settings.gecko.data_collection_permissions` so the
  Firefox submission states that no data is collected.

### Changed
- refactor: split the extension into one contract and four owners. `shared.js` holds
  the attribute names, storage keys and defaults, notice markers, probe size,
  overlay thresholds, timings, ad selectors, host patterns, and `dayKey`;
  `rules.json` owns network blocking, `rules.css` owns cosmetics, `content.js` owns
  the page defenses and DOM cleanup, and `bridge.js` owns storage.
- refactor: publish the contract to the page world as JSON on
  `<html data-teamx-contract>`. Chrome runs a content-script file once per frame,
  so `shared.js` cannot load in both worlds; `content.js` reads the published copy
  and rebuilds the regular expressions.
- refactor: scope every cosmetic selector with
  `:root:not([data-teamx-enabled="0"])`, so switching the extension off restores
  ads without touching the stylesheet. The attribute is absent during load, so ads
  are hidden from the first paint.
- refactor: coalesce mutation-observer callbacks into one animation frame and scope
  the ad-wrapper scan to structure instead of walking page text on every mutation.
- refactor: report swallowed hook failures when `window.__TEAMX_DEBUG__` is set, and
  keep the `Image` constructor's prototype and static members.
- docs: play the walkthroughs inline in `README.md`, `README_AR.md`,
  `docs/INSTALLATION.md`, and `docs/INSTALLATION_AR.md` through GitHub-hosted asset
  URLs, because GitHub strips `<video>` elements that point inside a repository.
- chore: block `propellerads.com`, `monetag.com`, `adsterra.com`, and `popads.net`
  declaratively, matching the JavaScript heuristics.

### Security
- fix: keep the CRX signing key out of git by name and by extension (`.pem`,
  `.key`, `.p12`, `.pfx`); the release workflow fails when a key file becomes
  tracked and purges the key from the runner even when packing fails.
- fix: trust `window.open` destinations only when the hostname is exactly
  `olympustaff.com` or a subdomain of it, so look-alike hosts such as
  `fakeolympustaff.com` can no longer pass.

### Audit & Cleanup
- fix: let the CRX release step run. A step `if` cannot read that step's own `env`,
  so the signing step never executed while the upload still expected the file; the
  secret stays scoped to the single step and the script now decides whether to
  sign.
- fix: release the protection switch when storage rejects. A rejected
  `chrome.storage.local.set` left the switch disabled with no way to interact, so
  the handler now releases it in a `finally`.
- fix: ignore Chrome's generated `_metadata/generated_indexed_rulesets/` cache, so
  runtime output can no longer be committed.
- chore: reduce source comments to the documented two-line attribution header and
  bring the configuration files to the project `─` header and section style.
- docs: align version badges, the auto-update examples, and both README project
  trees with the shipped package.
- Version bumped to 1.4.0 across `manifest.json`, `updates.xml`, and the
  documentation badges.

## [v1.3.0] - 2026-10-31

### Added
- feat: multi-layered blocking for in-page banners, popunders, and redirect popups
  on `olympustaff.com`.
- feat: declarative net request rules in `rules.json` blocking ad network assets
  (`acscdn.com`, `teethesmitsvah.com`, `blockadsnot.com`, `cnejpkmvsjvft.com`,
  `odpktokz.com`, `goodpics.net`).
- feat: cosmetic CSS in `rules.css` hiding `#fixedban`, `.body-top-ads`,
  `.body-bottom-ads`, and `.c-ads` without a layout shift.
- feat: pre-emptive neutering of `window.aclib` and defusal of the obfuscated
  popunder trigger.
- feat: click-hijacking prevention by intercepting
  `EventTarget.prototype.addEventListener` so ad redirect listeners cannot bind.
- feat: anti-adblock bypass that defuses BlockAdBlock and AdBlock Notice scripts in
  `window.eval` and fakes the ad image probes.
- feat: continuous DOM cleanup through a `MutationObserver` that purges dynamically
  injected ad wrappers and collapsed whitespace gaps.

## [v1.2.0] - 2026-10-30

### Changed
- chore: rebrand the repository and project to `teamx-adblock` /
  `TeamX - AdBlock`.
- chore: switch the license to the permissive MIT License.
- feat: redesign the brand shield (`Cyber Hex-Shield`) to match Olympus Staff's
  TeamX eagle proportions.
- docs: refactor the documentation banners with compact typographic lockups and
  Pango Arabic text rendering.
- docs: add the Arabic documentation suite (`docs/ARCHITECTURE_AR.md`,
  `docs/AUTO_UPDATE_AR.md`, `docs/INSTALLATION_AR.md`).
- chore: standardize commits as `teamx-adblock | <type>: <description>`.

## [v1.1.0] - 2026-10-30

### Added
- feat: complete Manifest V3 architecture with `world: "MAIN"` and
  `run_at: "document_start"`.
- feat: targeted suppression of unwanted redirects and ad popups (`goodpics.net`,
  `/go/3343952`).
- feat: safe passthrough for every legitimate `window.open` call.
- feat: vector brand iconography tailored for Olympus Staff (`olympustaff.com`).
- feat: automatic update protocol through `update_url` and `updates.xml`.
- feat: GitHub Actions packaging workflow for CRX generation and releases.
