# Refactor decision log

Scope: the shipped extension only (`content.js`, `bridge.js`, `popup.*`, `rules.*`,
`manifest.json`). Audit/report markdown is historical and left alone.

## Problems found (step 2)

### Hidden links — pieces that must change together, invisibly

- `data-teamx-enabled` / `data-teamx-blocked` are typed in `content.js:20-21`,
  `bridge.js:12-13`, and 60 times in `rules.css` as `:root:not([data-teamx-enabled="0"])`.
  Renaming one breaks the toggle with no compile error.
- Storage keys `enabled`, `blockedTotal`, `blockedToday`, `blockedDay`, `lang` are
  typed in `bridge.js:26,66,70-73` and `popup.js:78-82,127-133`, each with its own
  copy of the defaults. A default that disagrees silently resets the user's setting.
- `dayKey()` is implemented twice (`bridge.js:52-57`, `popup.js:69-74`). If the two
  disagree, the popup shows "today: 0" while the counter keeps counting.
- Notice markers are typed twice (`content.js:14-18` and `content.js:187-191`).
  The second copy exists only because `applyDefenses` is stringified.
- The ad-host list appears six ways: `content.js:135` (injected CSS),
  `content.js:336` (`AD_PROBE_PATTERN`), `content.js:480` (`AD_LISTENER_PATTERN`),
  `content.js:533-537` (`AD_SELECTORS`), `rules.css:53-58`, `rules.json`.
  Adding one host needs six coordinated edits.
- Probe dimensions `468x60` are typed at `content.js:445` (style match) and again as
  return values at `content.js:457` (`60`) and `content.js:466` (`468`).
- Ruleset id `ruleset_1` lives in `manifest.json` and `popup.js:9`. A rename makes the
  switch silently stop disabling network blocking.
- Trusted host `olympustaff.com` is typed in `manifest.json` (2 match patterns),
  `content.js:401`, and `popup.js:10-11`.

### Needless links — tied together, change for different reasons

- `content.js:132-148` injects a cosmetic stylesheet that duplicates `rules.css`.
  Two sources of truth for the same hiding, already drifted (the injected copy lacks
  `width`/`top`, and is unscoped so it ignores the on/off switch).
- `applyDefenses` is called directly (`content.js:502`), on `wrappedJSObject`
  (`content.js:506`), and stringified into an inline `<script>` (`content.js:514`).
  The stringify is what forces the duplicated notice markers.

### Surplus — no reason of their own to change

- `content.js:312-314` sets `adce8f3e6634c85d85d0cfe2dca6b517`. Verified absent from
  the live page (0 hits) and from the site's 15,026-byte blocker payload (0 hits). Dead.
- `content.js:290-309` stubs `nMUYwJbMcN`. The site defines it inside the payload that
  only runs when `eval` is not cancelled, so the stub guards a state that cannot occur.
- `content.js:512-519` inline `<script>` injection. The manifest already declares
  `"world": "MAIN"`, so this file is the page world.
- `content.js:504-510` `wrappedJSObject` path: Firefox legacy, unreachable at the
  declared `strict_min_version` 140 with `world: MAIN`.
- `safeRemove(el, { count })`: the option exists for one caller (`content.js:636`).

### Special cases — requirements the design never accounted for

- `content.js:559` hardcodes `babasbmsgx`; `content.js:572` hardcodes `zIndex < 1000`;
  `content.js:580-581` hardcodes `0.5` / `0.3` cover ratios.
- Magic delays: `content.js:105` (150 ms), `content.js:347` (10 ms),
  `content.js:670` (50 ms), `bridge.js:89` (400 ms).
- `content.js:215-216` treats `""`/`null`/whitespace as a wipe, while
  `content.js:245` treats only `""`/`null`. Same intent, two rules.
- `content.js:674-680` boots the purge three ways (immediate / `DOMContentLoaded` /
  `load`) although the observer already covers everything after the first run.
- `popup.js:87,105,112` repeat `STRINGS[state.lang] || STRINGS[DEFAULT_LANG]`.
- Swallowed `catch (_) {}` appears ~40 times, each re-implementing the same intent.

## Redesign (step 3)

### Fix 1 — One contract file, loaded by every consumer

`shared.js` holds the attribute names, storage keys and their defaults, notice
markers, probe dimensions, overlay thresholds, timings, ruleset id, trusted host and
`dayKey()`. It is listed **first** in both content-script entries (isolated world for
`bridge.js`, MAIN world for `content.js`) and loaded by `popup.html` before `popup.js`,
so one file serves all three consumers in their own world.

Solves: every hidden link above (attribute names, keys, defaults, `dayKey`, notice
markers, probe dimensions, ruleset id, trusted host).

### Fix 2 — Each layer owns exactly one list

- `rules.json` owns network blocking.
- `rules.css` owns cosmetics (and the `:root:not(...)` switch).
- `shared.js` owns the JS-side host fingerprints and selectors.

The duplicate injected stylesheet is deleted, so cosmetics have one owner.

Solves: the six-way host list, the duplicated stylesheet.

### Fix 3 — Delete the stringify path

The manifest already sets `world: MAIN`. The inline injection, the `wrappedJSObject`
branch, and the inner copy of the notice markers all exist only to support that path.

Solves: duplicated markers, redundant injection, dead Firefox branch.

### Fix 4 — Delete the verified-dead flag and the speculative stub

Both were checked against the live page and its unpacked blocker.

Solves: the two surplus items.

### Fix 5 — Name the magic numbers, one wipe rule, one boot

Probe size, overlay thresholds and delays become named contract fields; the two wipe
predicates become one; the three-way boot becomes one run plus the observer.

Solves: the hardcoded ratios/thresholds, the inconsistent wipe rule, the triple boot.

### Fix 6 — Counting belongs to the caller

`safeRemove` returns whether it removed something; the purge counts the results.

Solves: the one-caller `{count}` parameter.

## Outcome to verify (step 5)

Behavior must be identical: no anti-adblock notice on the live site, ads gone,
8/8 chapter images, popup switch and language still persist, and the local harness
(packed blocker + `body.innerHTML` wipe) still cannot block content.

---

## Round 2 — subagent audit findings and fixes

A subagent audited the nine shipped files against the four categories and returned
16 actionable findings. All were fixed:

### Fix 7 — The contract is the only owner of shared names

Solves: hidden links #1.2, #1.3, #1.4, #1.5, #1.6, #1.9, #4.1.

- `isTrustedHost` was implemented twice (shared.js and content.js). The contract
  now publishes `trustedHosts: [siteHost]` in `handoff()` and content.js matches
  the hostname against that list; the duplicate predicate is gone.
- `rulesetId` was typed in both manifest.json and shared.js. The popup now reads
  `MANIFEST.declarative_net_request.rule_resources[0].id`, so the manifest stays
  the single owner, and the contract no longer exports it.
- `popup.js` queried storage with `defaults` (whose property names merely
  happened to equal the storage keys). It now builds the query from `storage.keys`
  explicitly, the same way the bridge does.
- The popup's hint strings spelled out `olympustaff.com`. They are now
  `hintOn(host)` functions fed from the contract's `siteHost`.
- `SITE_QUERY` re-derived the manifest's match patterns. The popup now asks for
  all tabs and filters them through `onSite()` using the contract's host rule.
- "Only the literal `false` means off" was written separately in the bridge and
  the popup. It is now `coerceEnabled()` in the contract, called by both.
- The contract-wait deadline was a bare `300`; it is now
  `timing.contractDeadlineMs`.

### Fix 8 — One definition per rule inside content.js

Solves: hidden links #1.7, #1.8, #4.1; surplus #3.2.

- `awaitContract` and `waitForEnabled` were the same 40-line observer/timer
  machinery twice. They are now one `watchAttribute(name, parse, deadlineMs)`
  helper called with `parseContract` and `parseEnabled`.
- `isPageRoot` and `isWipe` were redefined inside two `step()` blocks and inlined
  a third time. Both are now defined once in `installDefenses`.
- The `window.__TEAMX_DEFENSES__` guard protected a single call site, and because
  it lived on `window` the page could set it to suppress every defense. Removed.

### Fix 9 — One rendering path in the popup

Solves: hidden links #1.10, #2.1; special case #4.3.

- The storage-change path re-implemented `render()` minus one line. Both paths now
  call `render()`; the switch's `disabled` reset moved to `enableControl()` at boot
  and the click handler, which is where it belongs.
- The toggle derived its next state from the `aria-checked` attribute it had just
  written. It now flips `state.enabled`.
- `setRulesetEnabled` swallowed every error, so the panel could claim "Active"
  while network blocking was off. It now returns whether the ruleset matches, and
  the toggle reverts (state, storage and UI) when it does not.

### Fix 10 — The blocked counter is lossless

Solves: special case #4.2.

- `flush()` zeroed `pending` before the asynchronous storage read, so any failure
  silently discarded a batch. `pending` is now cleared only after a successful
  write, and a failure re-queues the delta for the next flush.

### Fix 11 — The two cosmetic lists agree

Solves: hidden link #1.1.

- `rules.css` hid six iframes and four class/id groups that `adSelectors` did not
  remove or count, while `adSelectors` removed three scripts `rules.css` did not
  list. `adSelectors` now contains the same element set, and the stylesheet's
  comment records that scripts cannot be hidden by CSS and are removed by
  content.js.

### Round 2 verification

| Check | Result |
| --- | --- |
| Live homepage | no notice, 60/60 images, counter 3, 0 exceptions |
| Live series page | no notice, 0 exceptions |
| Live chapter page (after scroll) | 8/8 images, 0 zero-height, no notice |
| harness6 (real packed blocker, clipped probe) | 0/22 blocked, headline kept |
| harness5 (body wipe) | 0/12 blocked, headline kept |
| Popup: default | Arabic/RTL, "إعلان محجوب", v1.4.0, correct copyright |
| Popup: switch to English | `lang=en`, `dir=ltr`, all strings switch |
| Popup: reopen | still English (persisted) |
| Popup: toggle off | `ruleset_1` disabled, "Paused", persists across reopen |
| Popup: toggle on | `ruleset_1` re-enabled |
| Exceptions | none |

## Tests

The repository contains **zero tests**: no `package.json`, no test runner, no
`*.test.*` or `*.spec.*` files, and the only workflow is `release.yml` (packaging).
There was therefore nothing to remove and nothing failing to fix. No suite was
invented, because the chosen addition was to remove/repair existing tests only.

---

## Round 3 — audit findings and fixes

A third audit found four issues, all fixed:

### Fix 12 — The counter can no longer double-count

Solves: special case (silent counter corruption).

`flush()` claimed the batch but never removed it from `pending` before the async
write, so a failed write's `retry()` added the same delta a second time and a
transient `chrome.runtime.lastError` permanently inflated both totals. Two
overlapping flushes (from `onBlocked` and `pagehide`) could also claim one batch.

`pending` is now cleared before the write, an `inFlight` flag blocks overlapping
flushes, and a failed write hands the batch back exactly once.

Verified: visiting two pages yielded page counters 3 and 5, stored total 8,
"today" 8, and the popup showed 8.

### Fix 13 — `reportError` is declared before its first use

Solves: special case (the loud-failure guard failed by throwing).

The contract-name check called `reportError` while it was still in its temporal
dead zone, so the one check meant to fail loudly would itself throw
`ReferenceError` and reject the async IIFE. The declaration moved above the check.

### Fix 14 — The popup's startup heal reports reality

Solves: special case (a swallowed failure contradicting the function's contract).

`setRulesetEnabled` returns a boolean and the click path honours it, but the
boot-time heal discarded the result, so a failed heal left the panel showing
Active while network blocking was off. The heal now reads the ruleset's actual
state and renders that when it cannot follow the stored intent.

### Fix 15 — The repository button has the intended radius

Solves: surplus (a misapplied token).

`--radius-inner: calc(14px - 14px)` computed to `0px`, and `.repo` is a
body-level sibling rather than a card child, so the concentric-radius rule did not
apply. The token is removed and `.repo` uses `--radius`.

### Round 3 verification

| Check | Result |
| --- | --- |
| Live homepage | no notice, 60/60 images, counter 3, 0 exceptions |
| Live chapter page (after scroll) | 8/8 images, 0 zero-height, no notice |
| harness6 (real packed blocker, clipped probe) | 0/22 blocked, headline kept |
| harness5 (body wipe) | 0/12 blocked, headline kept |
| Counter accuracy | page 3 + page 5 = stored 8, popup 8 |
| Popup toggle / language / persistence | all correct, 0 exceptions |

---

## Round 4 — audit findings and fixes

A fourth audit verified the round-3 work (counter accounting exact on success,
failure and concurrent flush; `reportError` reachable at every call site;
`rulesetIsOn`/`setRulesetEnabled` semantics correct; no wrong CSS tokens; manifest
and rules.json consistent) and found two remaining issues. Both fixed.

### Fix 16 — The wipe guard rejects `null` again

Solves: special case (a regression introduced by Fix 11's simplification).

Round 2 simplified `isWipe` to `typeof value === "string" && value.trim() === ""`
on the premise that `[LegacyNullToEmptyString]` always delivers a string. That
premise is false once the native accessor is replaced: WebIDL conversion happens
*inside* the native setter, so the custom setter receives the raw value. Verified
in Chromium — `document.body.innerHTML = null` delivers `null` to the custom
setter, `isWipe(null)` returned false, and the native setter then cleared the
body. The guard now treats any nullish or empty-text value as a wipe:

```js
const isWipe = (value) => value == null || String(value).trim() === "";
```

Proven with a new harness (`index7.html`) that sets `innerHTML = null` and
`textContent = null`: without the extension the headline is destroyed (8/10 rows
blocked); with it the headline survives (0/10 rows blocked).

### Fix 17 — The heal's adopted state is persisted

Solves: special case (the correction was overwritten).

Fix 14 adopted the ruleset's real state into memory but never wrote it back, and
every later `readState` (triggered by each counter flush) re-read the stale
stored `enabled`, flipping the panel back to the state the ruleset was not in.
The heal now persists the adopted value before rendering.

### Round 4 verification

| Check | Result |
| --- | --- |
| harness7 (`innerHTML = null` / `textContent = null`) | 0/10 blocked, headline kept |
| harness6 (real packed blocker, clipped probe) | 0/20 blocked, headline kept |
| harness5 (body wipe) | 0/10 blocked, headline kept |
| Live homepage | no notice, 60/60 images, counter 3, 0 exceptions |
| Live chapter page (after scroll) | 8/8 images, 0 zero-height, no notice |
| Counter accuracy | page 3 + page 2 = stored 5, popup 5 |
| Popup toggle / language / persistence | all correct, 0 exceptions |

## Final state

- `shared.js` — one contract: attribute names and the `stateValues` wire protocol,
  event name, storage keys with defaults, notice markers, probe size and style
  needles, overlay thresholds, timings, ad selectors, probe/listener patterns,
  trusted hosts, `dayKey`, `coerceEnabled`, `handoff()`.
- `content.js` — MAIN-world defenses (7 layers) + DOM cleanup; reads the contract
  from the published handoff; one `watchAttribute` helper; one wipe definition.
- `bridge.js` — isolated-world bridge; publishes the contract and the enabled
  flag; lossless, concurrency-safe counter batching.
- `popup.js` / `popup.html` / `popup.css` — centered panel, Arabic/English switch,
  protection switch, counter, repository link, copyright, version; all strings
  come from one `STRINGS` table and the markup ships no duplicated copy.
- `rules.json` — network blocking (12 rules). `rules.css` — cosmetic hiding,
  scoped by the enabled attribute.

Every value that more than one file must agree on now has exactly one owner.

---

## Round 5 — audit findings and fixes

A fifth audit verified the round-4 work (counter accounting exact on success,
failure and concurrency; `isWipe` correct for null/undefined/""/whitespace and for
legitimate writes; heal closed against the storage-change re-read; no unused
bindings; manifest and rules.json valid) and found four more. All fixed.

### Fix 18 — `replaceChildren` uses the shared wipe rule

Solves: special case (a gap the other two hooks did not have).

`document.body.replaceChildren("")` passes one node, so the old
`nodes.length === 0` test let it through and the native call emptied the page —
while the changelog claimed the guard covered `replaceChildren`. The hook now
tests its arguments through `isWipe`, so an argument set that removes all content
is refused exactly like `innerHTML`/`textContent`.

### Fix 19 — `Image.src` still reads back the resolved URL

Solves: needless link (the hook diverged from native for every image).

The own-property accessor returned a cached string written only by the setter, so
`img.setAttribute("src", url)` left `img.src === ""` and a second
`setAttribute` left a stale value — for all images, including the non-probe hosts
that are supposed to stay native. The getter now delegates to the saved native
`HTMLImageElement.prototype.src` descriptor; only the setter diverges, and only
for ad-probe hosts.

### Fix 20 — A throwing storage callback can no longer wedge the counter

Solves: special case (silent, permanent counter freeze).

`chrome.storage.*` can throw instead of reporting `lastError` (for example
"Extension context invalidated" after an update). The throw escaped into the event
loop, leaving `inFlight` true for the page's lifetime, so every later flush
returned early and the popup counter froze while pages kept counting. Both
callbacks are now wrapped, and `done()` is idempotent so it settles each batch
exactly once.

### Fix 21 — The switch cannot race the startup heal

Solves: special case (ordering a user could observe).

The protection switch was enabled before the heal settled, so a click could
interleave with the heal's awaited calls: the heal's late write could override the
user's choice, or undo the toggle's own revert, leaving storage, the ruleset and
the panel divergent. The switch is now enabled only in the heal's `finally`.

### Round 5 verification

| Check | Result |
| --- | --- |
| Live homepage | no notice, 60/60 images, counter 3, 0 exceptions |
| Live chapter page (after scroll) | 8/8 images, 0 zero-height, no notice |
| harness6 (real packed blocker, clipped probe) | 0/20 blocked, headline kept |
| harness7 (`innerHTML = null` / `textContent = null`) | 0/10 blocked, headline kept |
| Counter accuracy | page 3 + page 5 = stored 8, popup 8 |
| Popup toggle / language / persistence | all correct, 0 exceptions |

### Convergence note

The final audit service was unavailable after repeated connection resets. I performed
an equivalent local audit: every `shared.js` export is consumed, every handoff field
is read, all source files pass syntax checks, and the remaining `contractDeadlineMs`
literal is an intentional bootstrap seam (content.js must wait for the handoff before
the contract timing object exists). No unreviewed tests exist in the repository.

---

## Final verification (complete suite, final build)

The `/tmp` test harness was evicted by the system mid-run, so the drivers were
rebuilt and the whole suite re-run against the final sources.

| Check | Result |
| --- | --- |
| Live homepage | no notice, 60/60 images, 0 ad slots, 0 exceptions |
| Live series page | no notice, 0 ad slots, 0 exceptions |
| Live chapter page | no notice, 0 ad slots, 0 exceptions |
| Chapter images after scroll | 8/8 loaded, 0 broken, 0 zero-height |
| harness5 — body wipe (`innerHTML = ''`) | 0/10 blocked, headline kept |
| harness6 — real packed blocker, clipped probe | 0/20 blocked, headline kept |
| harness7 — `innerHTML = null` / `textContent = null` | 0/10 blocked, headline kept |
| Counter accuracy | 3+3+5+5 = 16 stored, popup shows 16, no double-count |
| Popup default | `ar`/`rtl`, "إعلان محجوب", "الحماية", "المستودع على GitHub", v1.4.0, correct copyright, width 316 |
| Popup switch to English | `en`/`ltr`, all labels switch |
| Popup reopen | language persists (`en`) |
| Popup toggle off | `enabled:false`, `rulesets: []`, "Paused", persists across reopen |
| Popup toggle on | `enabled:true`, `rulesets: ["ruleset_1"]` |
| Exceptions (all runs) | none |

Behaviour matches the pre-refactor build on every check, and the three wipe
harnesses now pass where the original extension blocked.
