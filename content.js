// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock

(() => {
  const isTargetAd = (url) => {
    if (!url) return false;
    const str = String(url);
    return str.includes("goodpics.net") || str.includes("/go/3343952");
  };

  const hookTarget = (win) => {
    if (!win || !win.open) return;
    const originalOpen = win.open;
    win.open = function (url) {
      if (isTargetAd(url)) {
        return null;
      }
      return originalOpen.apply(this, arguments);
    };
  };

  // Direct page context hook (Chrome MAIN world & Firefox 128+)
  hookTarget(window);

  // Firefox Gecko isolated world access to host window
  if (typeof window.wrappedJSObject !== "undefined") {
    hookTarget(window.wrappedJSObject);
  }

  // Cross-browser DOM script injection fallback for document_start
  try {
    const code = `(() => {
      const orig = window.open;
      window.open = function (url) {
        if (url && (String(url).includes("goodpics.net") || String(url).includes("/go/3343952"))) {
          return null;
        }
        return orig.apply(this, arguments);
      };
    })();`;
    const script = document.createElement("script");
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (_) {}
})();
