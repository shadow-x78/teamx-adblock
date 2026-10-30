// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock
// Comprehensive Ad & Popup Blocker for Olympus Staff (olympustaff.com)

(() => {
  "use strict";

  // 1. Early CSS injection to guarantee zero-flicker ad suppression
  try {
    const css = `
      #fixedban, div[id*="fixedban"], a[onclick*="fixedban"],
      div[style*="z-index: 999999"], div[style*="z-index:999999"],
      .c-ads, .body-top-ads, .body-bottom-ads, div[class*="c-ads"],
      iframe[src*="acscdn"], iframe[src*="teethesmitsvah"], iframe[src*="goodpics"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -99999px !important;
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  } catch (_) {}

  // 2. Identify Target Ad URLs
  const isTargetAd = (url) => {
    if (!url) return true;
    const str = String(url).toLowerCase();
    if (
      str.includes("goodpics.net") ||
      str.includes("/go/") ||
      str.includes("acscdn") ||
      str.includes("teethesmitsvah") ||
      str.includes("blockadsnot") ||
      str.includes("cnejpkmvsjvft") ||
      str.includes("odpktokz") ||
      str.includes("propeller") ||
      str.includes("monetag") ||
      str.includes("adsterra") ||
      str.includes("popads") ||
      str.includes("bet") ||
      str.includes("casino")
    ) {
      return true;
    }
    try {
      const parsed = new URL(str, window.location.href);
      if (!parsed.hostname.endsWith("olympustaff.com")) {
        return true;
      }
    } catch (_) {
      return true;
    }
    return false;
  };

  // 3. Execution Context Initializer
  const applyDefenses = (win) => {
    if (!win) return;

    // A. Neutralize aclib (Adcash / Adsterra in-page ad runner)
    try {
      const noop = () => {};
      const noopProxy = new Proxy(noop, {
        get: () => noopProxy,
        apply: () => {}
      });
      Object.defineProperty(win, "aclib", {
        value: noopProxy,
        writable: false,
        configurable: false
      });
    } catch (_) {
      try {
        win.aclib = new Proxy(() => {}, { get: () => () => {}, apply: () => {} });
      } catch (_) {}
    }

    // B. Neutralize Obfuscated Popunder Script Loader
    try {
      win["adce8f3e6634c85d85d0cfe2dca6b517"] = true;
      Object.freeze(win["adce8f3e6634c85d85d0cfe2dca6b517"]);
    } catch (_) {}

    // C. Neutralize BlockAdBlock anti-adblock detection in eval
    try {
      const origEval = win.eval;
      win.eval = function (code) {
        if (
          typeof code === "string" &&
          (code.includes("يبدو أنك تستخدم مانع الإعلانات") ||
           code.includes("blockadblock"))
        ) {
          return undefined;
        }
        return origEval.apply(this, arguments);
      };
    } catch (_) {}

    // D. Bypass Fake Ad Image Probes (Simulate Immediate Success)
    try {
      const OrigImage = win.Image;
      if (OrigImage) {
        win.Image = function (w, h) {
          const img = new OrigImage(w, h);
          let currentSrc = "";
          Object.defineProperty(img, "src", {
            get: () => currentSrc,
            set: function (val) {
              currentSrc = val;
              if (
                typeof val === "string" &&
                (val.includes("doubleclick") ||
                 val.includes("ads.twitter") ||
                 val.includes("advertising.yahoo") ||
                 val.includes("pagead2") ||
                 val.includes("google_ad"))
              ) {
                setTimeout(() => {
                  try {
                    if (typeof img.onload === "function") {
                      img.onload(new Event("load"));
                    }
                  } catch (_) {}
                }, 10);
                return;
              }
              img.setAttribute("src", val);
            }
          });
          return img;
        };
      }
    } catch (_) {}

    // E. Hook window.open to suppress all ad popups
    if (win.open) {
      const originalOpen = win.open;
      win.open = function (url) {
        if (isTargetAd(url)) {
          return null;
        }
        return originalOpen.apply(this, arguments);
      };
    }

    // F. Hook addEventListener to prevent ad click-hijacking registration
    try {
      const origAddEventListener = win.EventTarget
        ? win.EventTarget.prototype.addEventListener
        : win.addEventListener;

      const targetProto = win.EventTarget ? win.EventTarget.prototype : win;
      targetProto.addEventListener = function (type, listener, options) {
        if (type === "click" || type === "mousedown" || type === "pointerdown") {
          if (typeof listener === "function") {
            try {
              const fnStr = Function.prototype.toString.call(listener);
              if (
                fnStr.includes("goodpics.net") ||
                fnStr.includes("/go/3343952") ||
                fnStr.includes("lastOpened") ||
                fnStr.includes("intervalSeconds") ||
                fnStr.includes("teethesmitsvah") ||
                fnStr.includes("aclib")
              ) {
                // Reject registering ad click hijacker
                return;
              }
            } catch (_) {}
          }
        }
        return origAddEventListener.apply(this, arguments);
      };
    } catch (_) {}
  };

  // Direct page context hook (Chrome MAIN world & Firefox 128+)
  applyDefenses(window);

  // Firefox Gecko isolated world access to host window
  if (typeof window.wrappedJSObject !== "undefined") {
    applyDefenses(window.wrappedJSObject);
  }

  // Cross-browser DOM script injection fallback for document_start
  try {
    const inlineScript = document.createElement("script");
    inlineScript.textContent = `(${applyDefenses.toString()})(window);`;
    (document.head || document.documentElement).appendChild(inlineScript);
    inlineScript.remove();
  } catch (_) {}

  // 4. DOM Purge & Continuous MutationObserver
  const purgeAdElements = () => {
    const adSelectors = [
      "#fixedban",
      "div[id*='fixedban']",
      "a[onclick*='fixedban']",
      ".body-top-ads",
      ".body-bottom-ads",
      ".c-ads",
      "div[class*='body-top-ads']",
      "div[class*='body-bottom-ads']",
      "div[style*='z-index: 999999']",
      "div[style*='z-index:999999']",
      "iframe[src*='acscdn']",
      "iframe[src*='teethesmitsvah']",
      "iframe[src*='goodpics']",
      "script[src*='acscdn']",
      "script[src*='teethesmitsvah']",
      "script[id='aclib']"
    ];

    adSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        try {
          el.remove();
        } catch (_) {
          el.style.display = "none";
        }
      });
    });

    // Clean up empty ad containers left by aclib to prevent blank whitespace
    document.querySelectorAll(".mb-3.mt-2").forEach((el) => {
      if (
        el.innerText.trim() === "" &&
        !el.querySelector("img, a, input, button, .swiper, .popular-manga")
      ) {
        try {
          el.remove();
        } catch (_) {}
      }
    });

    // Remove anti-adblock modal if dynamically inserted
    document.querySelectorAll("div, section").forEach((el) => {
      if (el.innerText && el.innerText.includes("يبدو أنك تستخدم مانع الإعلانات")) {
        try {
          el.remove();
        } catch (_) {}
        document.body.style.display = "";
        document.body.style.overflow = "";
      }
    });
  };

  // Run DOM cleanup during and after page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", purgeAdElements);
  } else {
    purgeAdElements();
  }

  window.addEventListener("load", purgeAdElements);

  // Active DOM Observer to kill dynamically spawned ads immediately
  try {
    const observer = new MutationObserver(() => {
      purgeAdElements();
    });
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true
    });
  } catch (_) {}
})();
