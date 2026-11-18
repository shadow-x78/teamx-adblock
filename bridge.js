// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock

(() => {
  "use strict";

  const { attrs, stateValues, events, storage, timing, coerceEnabled, handoff } = TeamXContract;
  const { keys, defaults } = storage;

  const root = document.documentElement;
  if (!root) return;

  try {
    root.setAttribute(attrs.contract, JSON.stringify(handoff()));
  } catch (_) {}

  const publish = (enabled) => {
    try {
      root.setAttribute(attrs.enabled, enabled ? stateValues.on : stateValues.off);
    } catch (_) {}
  };

  try {
    chrome.storage.local.get({ [keys.enabled]: defaults.enabled }, (state) => {
      if (chrome.runtime.lastError) {
        publish(defaults.enabled);
        return;
      }
      publish(coerceEnabled(state[keys.enabled]));
    });
  } catch (_) {
    publish(defaults.enabled);
  }

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local" || !changes[keys.enabled]) return;
      publish(coerceEnabled(changes[keys.enabled].newValue));
    });
  } catch (_) {}

  let reported = 0;
  let pending = 0;
  let flushTimer = null;
  let inFlight = false;

  const flush = () => {
    flushTimer = null;
    if (pending <= 0 || inFlight) return;

    const delta = pending;
    pending = 0;
    inFlight = true;

    let settled = false;
    const done = (written) => {
      if (settled) return;
      settled = true;
      inFlight = false;
      if (!written) pending += delta;
      if (pending > 0 && flushTimer === null) {
        flushTimer = setTimeout(flush, timing.flushBatchMs);
      }
    };

    try {
      const query = { [keys.total]: defaults.blockedTotal };
      chrome.storage.local.get(query, (state) => {
        try {
          if (chrome.runtime.lastError) {
            done(false);
            return;
          }
          chrome.storage.local.set(
            { [keys.total]: (state[keys.total] || 0) + delta },
            () => {
              try {
                done(!chrome.runtime.lastError);
              } catch (_) {
                done(false);
              }
            }
          );
        } catch (_) {
          done(false);
        }
      });
    } catch (_) {
      done(false);
    }
  };

  const onBlocked = () => {
    let total = 0;
    try {
      total = parseInt(root.getAttribute(attrs.blocked) || "0", 10) || 0;
    } catch (_) {
      return;
    }
    if (total <= reported) return;
    pending += total - reported;
    reported = total;
    if (flushTimer === null) flushTimer = setTimeout(flush, timing.flushBatchMs);
  };

  document.addEventListener(events.blocked, onBlocked, true);
  window.addEventListener("pagehide", flush);
})();
