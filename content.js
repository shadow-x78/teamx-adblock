// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock
// Comprehensive Ad & Popup Blocker for Olympus Staff (olympustaff.com)

(() => {
  "use strict";

  const AD_BLOCK_MARKER = "يبدو أنك تستخدم مانع الإعلانات";

  const reportError = (err) => {
    try {
      if (window.__TEAMX_DEBUG__) {
        console.warn("[TeamX]", err);
      }
    } catch (_) {}
  };

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
  } catch (e) {
    reportError(e);
  }

  const applyDefenses = (win) => {
    if (!win) return;

    const report = (err) => {
      try {
        if (win.__TEAMX_DEBUG__) {
          console.warn("[TeamX]", err);
        }
      } catch (_) {}
    };

    const isTargetAd = (url) => {
      if (!url) return true;
      const str = String(url).toLowerCase();
      if (str.includes("/go/")) return true;
      let parsed;
      try {
        parsed = new URL(str, win.location.href);
      } catch (e) {
        report(e);
        return true;
      }
      const host = parsed.hostname.toLowerCase();
      const adHosts = [
        "goodpics.net",
        "acscdn",
        "teethesmitsvah",
        "blockadsnot",
        "cnejpkmvsjvft",
        "odpktokz",
        "propeller",
        "monetag",
        "adsterra",
        "popads"
      ];
      if (adHosts.some((marker) => host.includes(marker))) return true;
      const trusted = host === "olympustaff.com" || host.endsWith(".olympustaff.com");
      return !trusted;
    };

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
    } catch (e) {
      report(e);
      try {
        win.aclib = new Proxy(() => {}, { get: () => () => {}, apply: () => {} });
        if (typeof win.aclib === "undefined") {
          report(new Error("aclib hook could not be installed"));
        }
      } catch (e) {
        report(e);
      }
    }

    try {
      win["adce8f3e6634c85d85d0cfe2dca6b517"] = true;
      Object.freeze(win["adce8f3e6634c85d85d0cfe2dca6b517"]);
    } catch (e) {
      report(e);
    }

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
    } catch (e) {
      report(e);
    }

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
                  } catch (e) {
                    report(e);
                  }
                }, 10);
                return;
              }
              img.setAttribute("src", val);
            }
          });
          return img;
        };
        win.Image.prototype = OrigImage.prototype;
        Object.setPrototypeOf(win.Image, OrigImage);
      }
    } catch (e) {
      report(e);
    }

    if (win.open) {
      const originalOpen = win.open;
      win.open = function (url) {
        if (isTargetAd(url)) {
          return null;
        }
        return originalOpen.apply(this, arguments);
      };
    }

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
                return;
              }
            } catch (e) {
              report(e);
            }
          }
        }
        return origAddEventListener.apply(this, arguments);
      };
    } catch (e) {
      report(e);
    }
  };

  applyDefenses(window);

  if (typeof window.wrappedJSObject !== "undefined") {
    applyDefenses(window.wrappedJSObject);
  }

  try {
    const inlineScript = document.createElement("script");
    inlineScript.textContent = `(${applyDefenses.toString()})(window);`;
    (document.head || document.documentElement).appendChild(inlineScript);
    inlineScript.remove();
  } catch (e) {
    reportError(e);
  }

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
        } catch (e) {
          reportError(e);
          el.style.display = "none";
        }
      });
    });

    document.querySelectorAll(".mb-3.mt-2").forEach((el) => {
      if (
        el.innerText.trim() === "" &&
        !el.querySelector("img, a, input, button, .swiper, .popular-manga")
      ) {
        try {
          el.remove();
        } catch (e) {
          reportError(e);
        }
      }
    });

    const body = document.body;
    if (body && body.innerText && body.innerText.includes(AD_BLOCK_MARKER)) {
      document.querySelectorAll("div, section").forEach((el) => {
        if (el.innerText && el.innerText.includes(AD_BLOCK_MARKER)) {
          try {
            el.remove();
          } catch (e) {
            reportError(e);
          }
          body.style.display = "";
          body.style.overflow = "";
        }
      });
    }
  };

  let purgeScheduled = false;
  const schedulePurge = () => {
    if (purgeScheduled) return;
    purgeScheduled = true;
    const run = () => {
      purgeScheduled = false;
      purgeAdElements();
    };
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(run);
    } else {
      setTimeout(run, 50);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", purgeAdElements);
  } else {
    purgeAdElements();
  }

  window.addEventListener("load", purgeAdElements);

  try {
    const observer = new MutationObserver(() => {
      schedulePurge();
    });
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true
    });
  } catch (e) {
    reportError(e);
  }
})();
