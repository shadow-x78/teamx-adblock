// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock
// Comprehensive Ad & Popup Blocker for Olympus Staff (olympustaff.com)

(() => {
  "use strict";

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

  const applyDefenses = (win) => {
    if (!win) return;

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

    try {
      win["adce8f3e6634c85d85d0cfe2dca6b517"] = true;
      Object.freeze(win["adce8f3e6634c85d85d0cfe2dca6b517"]);
    } catch (_) {}

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
            } catch (_) {}
          }
        }
        return origAddEventListener.apply(this, arguments);
      };
    } catch (_) {}
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
  } catch (_) {}

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", purgeAdElements);
  } else {
    purgeAdElements();
  }

  window.addEventListener("load", purgeAdElements);

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
