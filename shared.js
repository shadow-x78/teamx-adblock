// TeamX - AdBlock (MIT)
// One contract for every value that more than one file has to agree on.
//
// Owner: this file, loaded by the isolated-world entry (which Chrome runs before
// the MAIN entry) and by popup.html.
//
// content.js cannot load it: Chrome runs a content-script file once per frame,
// so listing the same path in both entries leaves the MAIN entry with nothing
// (verified: content.js then throws ReferenceError). bridge.js therefore
// publishes the serializable `handoff()` on <html> and content.js reads it.
//
// What deliberately is NOT here:
//   - rules.json    owns network blocking.
//   - rules.css     owns cosmetic hiding (mirrors `adSelectors`; CSS cannot read
//                   a JS constant).
//   - manifest.json owns the host match patterns.

const TeamXContract = (() => {
  "use strict";

  const attrs = Object.freeze({
    enabled: "data-teamx-enabled",
    blocked: "data-teamx-blocked",
    contract: "data-teamx-contract"
  });

  // The value protocol for `attrs.enabled`. rules.css matches the off value
  // literally (`:root:not([data-teamx-enabled="0"])`); that is the only other
  // place that knows these strings.
  const stateValues = Object.freeze({ on: "1", off: "0" });

  const events = Object.freeze({
    blocked: "teamx:blocked"
  });

  const storage = Object.freeze({
    keys: Object.freeze({
      enabled: "enabled",
      total: "blockedTotal",
      today: "blockedToday",
      day: "blockedDay",
      lang: "lang"
    }),
    defaults: Object.freeze({
      enabled: true,
      blockedTotal: 0,
      blockedToday: 0,
      blockedDay: "",
      lang: "ar"
    })
  });

  // Text the site's blockadblock build puts on its blocking screen. Matched
  // against script text (to cancel the packed blocker) and page text (to find
  // the overlay).
  const noticeMarkers = Object.freeze([
    "يبدو أنك تستخدم مانع الإعلانات",
    "لقد فهمت، لقد عطلت مانع الإعلانات",
    "blockadblock"
  ]);

  // The site paints this box off-screen and treats a zero measurement as an
  // adblocker, so the style needles and the reported size must agree.
  const probe = Object.freeze({
    width: 468,
    height: 60,
    styleNeedles: Object.freeze(["468px", "60px"])
  });

  const overlay = Object.freeze({
    idPattern: /babasbmsgx/i,
    minZIndex: 1000,
    minWidthRatio: 0.5,
    minHeightRatio: 0.3,
    // An element holding these is content, never the blocking screen.
    contentSelector:
      "img[src*='uploads'], .manga-chapter-img, .image_list, .reading-content"
  });

  const timing = Object.freeze({
    stateDeadlineMs: 150,
    fakeImageDelayMs: 10,
    flushBatchMs: 400
  });

  // Elements the cleanup layer removes and counts. rules.css must hide exactly
  // these; `checkCosmeticParity` in the refactor log records how the two are
  // kept in step (a stylesheet cannot read a JS constant, so the list is
  // duplicated there by necessity, and only there).
  const adSelectors = Object.freeze([
    "#fixedban",
    "div[id*='fixedban']",
    "a[onclick*='fixedban']",
    ".body-top-ads",
    ".body-bottom-ads",
    ".c-ads",
    "div[class*='body-top-ads']",
    "div[class*='body-bottom-ads']",
    "iframe[src*='acscdn']",
    "iframe[src*='teethesmitsvah']",
    "iframe[src*='goodpics']",
    "iframe[src*='blockadsnot']",
    "iframe[src*='cnejpkmvsjvft']",
    "iframe[src*='odpktokz']",
    "script[src*='acscdn']",
    "script[src*='teethesmitsvah']",
    "script[id='aclib']"
  ]);

  // Hosts the site uses for ad-probe images. Only these are faked; every other
  // image keeps native behaviour so page images always load.
  const probeHostPattern =
    /doubleclick|googlesyndication|pagead2|google_ad|ads\.twitter|advertising\.yahoo|ads\.yahoo|adn\.ebay|ad\.mail\.ru|juicyads|adcash|propeller|monetag|adsterra|popads|goodpics|acscdn/i;

  // Fingerprints of click-hijacking listeners. Narrow on purpose: a generic
  // `aclib` match used to cancel the site's own working controls.
  const listenerPattern =
    /goodpics\.net|\/go\/3343952|lastOpened|intervalSeconds|teethesmitsvah/i;

  const siteHost = "olympustaff.com";

  // The one rule for reading a stored `enabled` value: only the literal `false`
  // means off. Shared so the bridge and the popup cannot disagree.
  const coerceEnabled = (value) => value !== false;

  const dayKey = (date = new Date()) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  };

  // The subset content.js needs, as plain JSON. Regular expressions cross the
  // world seam as their source text and are rebuilt on the other side.
  const handoff = () =>
    Object.freeze({
      attrs,
      stateValues,
      events,
      noticeMarkers,
      probe,
      overlay: {
        idPattern: overlay.idPattern.source,
        minZIndex: overlay.minZIndex,
        minWidthRatio: overlay.minWidthRatio,
        minHeightRatio: overlay.minHeightRatio,
        contentSelector: overlay.contentSelector
      },
      timing,
      adSelectors,
      probeHostPattern: probeHostPattern.source,
      listenerPattern: listenerPattern.source,
      trustedHosts: Object.freeze([siteHost])
    });

  // Only what the isolated world and the popup actually read. Everything the
  // MAIN world needs travels through handoff().
  return Object.freeze({
    attrs,
    stateValues,
    events,
    storage,
    timing,
    siteHost,
    dayKey,
    coerceEnabled,
    handoff
  });
})();
