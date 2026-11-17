// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock
//
// Runs in the page's MAIN world (see manifest.json) so it can install the
// anti-adblock defenses before the site's own scripts.
//
// The site's blocker wipes `document.body` and paints a full-screen notice when
// it thinks an adblocker is present, so every layer here exists either to keep
// that detection from firing or to keep the content on screen when it does.

(async () => {
  "use strict";

  // The contract is owned by the isolated world: Chrome runs a content-script
  // file once per frame, so listing shared.js in both entries would leave this
  // world with nothing (verified: ReferenceError). The bridge publishes it on
  // <html> as JSON, which is the only channel between the worlds.
  const ATTR_CONTRACT = "data-teamx-contract";

  const reportError = (err) => {
    try {
      if (window.__TEAMX_DEBUG__) {
        console.warn("[TeamX]", err);
      }
    } catch (_) {}
  };

  // Wait for an attribute to reach a value, then parse it. Both the contract and
  // the on/off flag arrive this way, so the settle/disconnect logic lives once.
  const watchAttribute = (name, parse, deadlineMs) =>
    new Promise((resolve) => {
      const root = document.documentElement;
      if (!root) {
        resolve(null);
        return;
      }

      const known = parse(root.getAttribute(name));
      if (known !== null) {
        resolve(known);
        return;
      }

      let settled = false;
      let observer = null;
      let timer = null;

      const finish = (value) => {
        if (settled) return;
        settled = true;
        try {
          if (observer) observer.disconnect();
        } catch (_) {}
        if (timer !== null) clearTimeout(timer);
        resolve(value);
      };

      observer = new MutationObserver(() => {
        const value = parse(root.getAttribute(name));
        if (value !== null) finish(value);
      });
      try {
        observer.observe(root, { attributes: true, attributeFilter: [name] });
      } catch (_) {
        finish(null);
        return;
      }

      timer = setTimeout(() => finish(parse(root.getAttribute(name))), deadlineMs);
    });

  const parseContract = (raw) => {
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      return {
        ...data,
        overlay: { ...data.overlay, idPattern: new RegExp(data.overlay.idPattern, "i") },
        probeHostPattern: new RegExp(data.probeHostPattern, "i"),
        listenerPattern: new RegExp(data.listenerPattern, "i")
      };
    } catch (_) {
      return null;
    }
  };

  const parseEnabled = (raw, values) => (raw === null ? null : raw === values.on);

  // Bootstrap seam: the contract is not available until the bridge publishes it,
  // so this one deadline must live before the handoff can be parsed.
  const contractDeadlineMs = 300;
  const contract = await watchAttribute(ATTR_CONTRACT, parseContract, contractDeadlineMs);
  if (!contract) return;

  // The bootstrap name is the one literal this world must know before it can
  // parse anything; fail loudly if the contract renamed it.
  if (contract.attrs.contract !== ATTR_CONTRACT) {
    reportError(new Error("contract attribute name mismatch"));
    return;
  }

  const { attrs, stateValues, events, noticeMarkers, probe, timing, adSelectors } = contract;
  const { overlay, probeHostPattern, listenerPattern, trustedHosts } = contract;
  const isTrustedHost = (host) => {
    const name = String(host || "").toLowerCase();
    return trustedHosts.some((allowed) => name === allowed || name.endsWith("." + allowed));
  };

  // The bridge publishes the stored state on <html> before this runs. Waiting
  // for the attribute (with a deadline) is what keeps a disabled extension from
  // touching the page at all.
  const enabled = await watchAttribute(
    attrs.enabled,
    (raw) => parseEnabled(raw, stateValues),
    timing.stateDeadlineMs
  );
  if (enabled === false) return;

  // The popup can switch the extension off without a reload; stop cleaning when
  // it does. rules.css carries the same switch for the cosmetic layer.
  let active = true;
  try {
    const watcher = new MutationObserver(() => {
      if (parseEnabled(document.documentElement.getAttribute(attrs.enabled), stateValues) === false) {
        active = false;
        watcher.disconnect();
      }
    });
    watcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attrs.enabled]
    });
  } catch (_) {}

  const containsNotice = (value) => {
    if (!value) return false;
    const text = String(value);
    return noticeMarkers.some((marker) => text.includes(marker));
  };

  // Each defense is installed independently: one failing must not disable the
  // rest, since the site only needs a single gap to block the page.
  const step = (fn) => {
    try {
      fn();
    } catch (e) {
      reportError(e);
    }
  };

  const installDefenses = () => {
    const doc = document;

    // The blocker's only way to hide the page is to empty the root element, so
    // "a wipe" is defined once and reused by all three hooks below.
    const isPageRoot = (el) => el === doc.body || el === doc.documentElement;
    // Replacing the native accessor means WebIDL no longer converts the value,
    // so `null` arrives as `null` here — and the native setter clears the node
    // for it, which is a wipe. Anything whose text is empty counts.
    const isWipe = (value) => value == null || String(value).trim() === "";


    // The blocker empties `document.body` before painting its notice. Refusing
    // that assignment is what preserves the page.
    step(() => {
      const proto = window.Element && window.Element.prototype;
      if (!proto) return;
      const desc = Object.getOwnPropertyDescriptor(proto, "innerHTML");
      if (!desc || typeof desc.set !== "function" || typeof desc.get !== "function") return;

      Object.defineProperty(proto, "innerHTML", {
        configurable: true,
        enumerable: desc.enumerable,
        get: desc.get,
        set(value) {
          if (isPageRoot(this) && isWipe(value)) {
            reportError(new Error("blocked body innerHTML wipe"));
            return;
          }
          return desc.set.call(this, value);
        }
      });
    });

    step(() => {
      const proto = window.Node && window.Node.prototype;
      if (!proto) return;
      const desc = Object.getOwnPropertyDescriptor(proto, "textContent");
      if (!desc || typeof desc.set !== "function" || typeof desc.get !== "function") return;

      Object.defineProperty(proto, "textContent", {
        configurable: true,
        enumerable: desc.enumerable,
        get: desc.get,
        set(value) {
          if (isPageRoot(this) && isWipe(value)) {
            reportError(new Error("blocked body textContent wipe"));
            return;
          }
          return desc.set.call(this, value);
        }
      });
    });

    step(() => {
      const proto = window.Element && window.Element.prototype;
      if (!proto || typeof proto.replaceChildren !== "function") return;
      const original = proto.replaceChildren;
      proto.replaceChildren = function (...nodes) {
        const removesAllContent =
          nodes.length === 0 ||
          nodes.every((node) => {
            const value = node && typeof node === "object" ? node.textContent : node;
            return isWipe(value);
          });
        if (isPageRoot(this) && removesAllContent) {
          reportError(new Error("blocked body replaceChildren wipe"));
          return;
        }
        return original.apply(this, arguments);
      };
    });

    // Inline scripts call `aclib.runBanner({zoneId})`. A callable, chainable
    // no-op keeps those calls from throwing while no banner is ever rendered.
    // An accessor (not a value) stops the loader's assignment from replacing it.
    step(() => {
      const noop = () => {};
      const noopProxy = new Proxy(noop, {
        get: () => noopProxy,
        apply: () => undefined
      });

      Object.defineProperty(window, "aclib", {
        configurable: true,
        enumerable: true,
        get: () => noopProxy,
        set: () => {
          reportError(new Error("ignored aclib reassignment"));
        }
      });
    });

    step(() => {
      const originalEval = window.eval;
      if (typeof originalEval !== "function") return;
      window.eval = function (code) {
        if (typeof code === "string" && containsNotice(code)) {
          reportError(new Error("cancelled packed blocker"));
          return undefined;
        }
        return originalEval.apply(this, arguments);
      };
    });

    // The blocker builds `new Image()` against ad hosts and treats `onerror` as
    // proof of blocking. Faking the load for those hosts only leaves real page
    // images on the native path.
    step(() => {
      const NativeImage = window.Image;
      if (!NativeImage) return;
      const nativeSrc = Object.getOwnPropertyDescriptor(
        window.HTMLImageElement.prototype,
        "src"
      );
      if (!nativeSrc || typeof nativeSrc.get !== "function") return;

      const fakeLoad = (img) => {
        window.setTimeout(() => {
          try {
            if (typeof img.onload === "function") {
              img.onload(new window.Event("load"));
            }
          } catch (e) {
            reportError(e);
          }
        }, timing.fakeImageDelayMs);
      };

      const ImageHook = function (width, height) {
        const img = new NativeImage(width, height);

        // The getter must stay native so page code that reads `img.src` back
        // (lazyloaders, cache keys) still sees the resolved URL, including after
        // a `setAttribute`. Only the setter diverges, and only for ad probes.
        const hookSrc = () => {
          Object.defineProperty(img, "src", {
            configurable: true,
            get: function () {
              return nativeSrc.get.call(img);
            },
            set: function (value) {
              if (typeof value === "string" && probeHostPattern.test(value)) {
                fakeLoad(img);
                return;
              }
              img.setAttribute("src", value);
            }
          });
        };

        try {
          hookSrc();
        } catch (e) {
          reportError(e);
          // Some pages lock `src`; intercept setAttribute instead.
          try {
            const originalSetAttribute = img.setAttribute;
            img.setAttribute = function (name, value) {
              if (String(name).toLowerCase() === "src" && probeHostPattern.test(String(value))) {
                fakeLoad(img);
                return undefined;
              }
              return originalSetAttribute.apply(this, arguments);
            };
          } catch (e2) {
            reportError(e2);
          }
        }
        return img;
      };

      ImageHook.prototype = NativeImage.prototype;
      try {
        Object.setPrototypeOf(ImageHook, NativeImage);
      } catch (e) {
        reportError(e);
      }
      window.Image = ImageHook;
    });

    step(() => {
      if (typeof window.open !== "function") return;
      const originalOpen = window.open;

      window.open = function (url) {
        try {
          if (!url) return originalOpen.apply(this, arguments);
          const parsed = new window.URL(String(url), window.location.href);
          if (!isTrustedHost(parsed.hostname)) {
            reportError(new Error("blocked popup to " + parsed.hostname));
            return null;
          }
        } catch (_) {
          return null;
        }
        return originalOpen.apply(this, arguments);
      };
    });

    // The blocker measures a 468x60 box it paints off-screen and blocks when the
    // measurement collapses to 0 — which any cosmetic rule that clips the box,
    // or any browser that reports 0 for an offscreen box, would cause. Reporting
    // the intended size for that one probe keeps detection from ever firing.
    step(() => {
      const proto = window.Element && window.Element.prototype;
      if (!proto) return;
      const heightDesc = Object.getOwnPropertyDescriptor(proto, "clientHeight");
      const widthDesc = Object.getOwnPropertyDescriptor(proto, "clientWidth");
      if (!heightDesc || !widthDesc) return;

      // `clientHeight` is read constantly by layout code, so the verdict is
      // cached per element.
      const probeCache = new WeakMap();

      const isProbe = (el) => {
        if (!el || el.nodeType !== 1) return false;
        const cached = probeCache.get(el);
        if (cached !== undefined) return cached;

        let verdict = false;
        try {
          const style = el.getAttribute && el.getAttribute("style");
          verdict =
            !!style && probe.styleNeedles.every((needle) => style.includes(needle));
        } catch (_) {
          verdict = false;
        }
        probeCache.set(el, verdict);
        return verdict;
      };

      Object.defineProperty(proto, "clientHeight", {
        configurable: true,
        enumerable: heightDesc.enumerable,
        get() {
          if (isProbe(this)) return probe.height;
          return heightDesc.get.call(this);
        }
      });

      Object.defineProperty(proto, "clientWidth", {
        configurable: true,
        enumerable: widthDesc.enumerable,
        get() {
          if (isProbe(this)) return probe.width;
          return widthDesc.get.call(this);
        }
      });
    });

    step(() => {
      const proto = window.EventTarget && window.EventTarget.prototype;
      if (!proto || typeof proto.addEventListener !== "function") return;
      const original = proto.addEventListener;

      proto.addEventListener = function (type, listener, options) {
        if (
          (type === "click" || type === "mousedown" || type === "pointerdown") &&
          typeof listener === "function"
        ) {
          try {
            const source = window.Function.prototype.toString.call(listener);
            if (listenerPattern.test(source)) {
              reportError(new Error("blocked ad click listener"));
              return;
            }
          } catch (e) {
            reportError(e);
          }
        }
        return original.apply(this, arguments);
      };
    });
  };

  installDefenses();

  const removeElement = (el) => {
    if (!el || !el.isConnected) return false;
    try {
      el.remove();
    } catch (e) {
      reportError(e);
      try {
        el.style.display = "none";
      } catch (_) {}
    }
    return true;
  };

  const countBlocked = (n) => {
    if (n <= 0) return;
    try {
      const root = document.documentElement;
      if (!root) return;
      const current = parseInt(root.getAttribute(attrs.blocked) || "0", 10) || 0;
      root.setAttribute(attrs.blocked, String(current + n));
      document.dispatchEvent(new Event(events.blocked));
    } catch (_) {}
  };

  // The blocking screen is a full-screen, high-z layer carrying the notice.
  // Ancestors of it are content, so only the overlay itself is ever removed.
  const isBlockingOverlay = (el) => {
    if (!el || el.nodeType !== 1) return false;
    if (el === document.body || el === document.documentElement) return false;
    if (overlay.idPattern.test(el.id || "")) return true;

    const text = el.textContent || "";
    if (!noticeMarkers.some((marker) => text.includes(marker))) return false;

    let style;
    try {
      style = window.getComputedStyle(el);
    } catch (_) {
      return false;
    }
    const positioned = style.position === "fixed" || style.position === "absolute";
    const zIndex = parseInt(style.zIndex, 10);
    if (!positioned || !Number.isFinite(zIndex) || zIndex < overlay.minZIndex) return false;

    let rect;
    try {
      rect = el.getBoundingClientRect();
    } catch (_) {
      return false;
    }
    if (rect.width < window.innerWidth * overlay.minWidthRatio) return false;
    if (rect.height < window.innerHeight * overlay.minHeightRatio) return false;

    return !el.querySelector(overlay.contentSelector);
  };

  const removeBlockOverlays = () => {
    const body = document.body;
    if (!body) return;

    // Reading computed styles per element is expensive, so the scan only runs
    // when the notice is actually present.
    const bodyText = body.textContent || "";
    if (!noticeMarkers.some((marker) => bodyText.includes(marker))) return;

    for (const el of Array.from(document.querySelectorAll("body *"))) {
      if (el.isConnected && isBlockingOverlay(el)) removeElement(el);
    }
  };

  // Undo the visibility/scroll locks the blocker applies while it paints.
  const restorePage = () => {
    const body = document.body;
    if (!body) return;
    try {
      if (body.style.visibility === "hidden") body.style.removeProperty("visibility");
      if (body.style.display === "none") body.style.removeProperty("display");
      if (body.style.overflow === "hidden") body.style.removeProperty("overflow");
      if (document.documentElement.style.visibility === "hidden") {
        document.documentElement.style.removeProperty("visibility");
      }
    } catch (e) {
      reportError(e);
    }
  };

  const purge = () => {
    if (!active) return;

    let removed = 0;
    for (const selector of adSelectors) {
      for (const el of document.querySelectorAll(selector)) {
        if (removeElement(el)) removed += 1;
      }
    }
    countBlocked(removed);

    // Empty ad wrappers left after their slot is gone. Not counted: the ad
    // inside was counted when it was removed.
    for (const el of document.querySelectorAll(".mb-3.mt-2")) {
      try {
        if (el.querySelector("img, a, input, button, iframe, video, canvas, .swiper, .popular-manga")) {
          continue;
        }
        if ((el.textContent || "").trim() !== "") continue;
        removeElement(el);
      } catch (e) {
        reportError(e);
      }
    }

    removeBlockOverlays();
    restorePage();
  };

  let scheduled = false;
  const schedulePurge = () => {
    if (scheduled) return;
    scheduled = true;
    const run = () => {
      scheduled = false;
      purge();
    };
    requestAnimationFrame(run);
  };

  purge();

  // Ads are injected after load, so the observer is the steady-state path; the
  // initial run above covers content already in the document.
  try {
    const observer = new MutationObserver(schedulePurge);
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true
    });
  } catch (e) {
    reportError(e);
  }
})();
