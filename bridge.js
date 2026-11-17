// TeamX - AdBlock (MIT)
// Isolated-world bridge between chrome.storage and the page.
//
// content.js runs in the MAIN world and cannot use extension APIs, so this file
// publishes the stored on/off state on <html> (which content.js and rules.css
// both read) and forwards the blocked-ad counter back into storage.

(() => {
  "use strict";

  const { attrs, stateValues, events, storage, timing, dayKey, coerceEnabled, handoff } = TeamXContract;
  const { keys, defaults } = storage;

  const root = document.documentElement;
  if (!root) return;

  // Published first: content.js runs in the MAIN world, which cannot see this
  // scope, and reads the contract from this attribute.
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

  // content.js keeps a running total on <html> and fires one event per removal.
  // Only the delta is persisted, batched so storage writes stay rare.
  let reported = 0;
  let pending = 0;
  let flushTimer = null;
  let inFlight = false;

  const flush = () => {
    flushTimer = null;
    // `inFlight` keeps two overlapping writes from claiming the same batch.
    if (pending <= 0 || inFlight) return;

    // The batch leaves `pending` before the async write, so a concurrent
    // `onBlocked`/`pagehide` cannot claim it too; a failed write hands it back.
    const delta = pending;
    pending = 0;
    inFlight = true;

    // Settles the batch exactly once. A storage call can *throw* instead of
    // reporting `lastError` (e.g. "Extension context invalidated" after an
    // update), which would otherwise leave `inFlight` stuck true and strand
    // every later batch.
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
      const query = {
        [keys.total]: defaults.blockedTotal,
        [keys.today]: defaults.blockedToday,
        [keys.day]: defaults.blockedDay
      };
      chrome.storage.local.get(query, (state) => {
        try {
          if (chrome.runtime.lastError) {
            done(false);
            return;
          }
          const today = dayKey();
          const todayBase = state[keys.day] === today ? state[keys.today] || 0 : 0;
          chrome.storage.local.set(
            {
              [keys.total]: (state[keys.total] || 0) + delta,
              [keys.today]: todayBase + delta,
              [keys.day]: today
            },
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
