// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock

(() => {
  "use strict";

  const { attrs, stateValues, messages, storage, coerceEnabled, handoff } = TeamXContract;
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

  try {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!message || message.type !== messages.count) return false;
      const value = parseInt(root.getAttribute(attrs.blocked) || "0", 10) || 0;
      sendResponse({ count: value });
      return false;
    });
  } catch (_) {}

})();
