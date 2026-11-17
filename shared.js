// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock

const TeamXContract = (() => {
  "use strict";

  const attrs = Object.freeze({
    enabled: "data-teamx-enabled",
    blocked: "data-teamx-blocked",
    contract: "data-teamx-contract"
  });

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

  const noticeMarkers = Object.freeze([
    "يبدو أنك تستخدم مانع الإعلانات",
    "لقد فهمت، لقد عطلت مانع الإعلانات",
    "blockadblock"
  ]);

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
    contentSelector:
      "img[src*='uploads'], .manga-chapter-img, .image_list, .reading-content"
  });

  const timing = Object.freeze({
    stateDeadlineMs: 150,
    fakeImageDelayMs: 10,
    flushBatchMs: 400
  });

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

  const probeHostPattern =
    /doubleclick|googlesyndication|pagead2|google_ad|ads\.twitter|advertising\.yahoo|ads\.yahoo|adn\.ebay|ad\.mail\.ru|juicyads|adcash|propeller|monetag|adsterra|popads|goodpics|acscdn/i;

  const listenerPattern =
    /goodpics\.net|\/go\/3343952|lastOpened|intervalSeconds|teethesmitsvah/i;

  const siteHost = "olympustaff.com";

  const coerceEnabled = (value) => value !== false;

  const dayKey = (date = new Date()) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  };

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
