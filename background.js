// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock

if (typeof importScripts === "function" && typeof TeamXContract === "undefined") {
  importScripts("shared.js");
}

const { siteHost } = TeamXContract;

const isSite = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === siteHost || host.endsWith("." + siteHost);
  } catch (_) {
    return false;
  }
};

const syncTab = async (tabId, url) => {
  try {
    if (isSite(url)) {
      await chrome.action.enable(tabId);
    } else {
      await chrome.action.disable(tabId);
    }
  } catch (_) {}
};

const syncAll = async () => {
  let tabs = [];
  try {
    tabs = await chrome.tabs.query({});
  } catch (_) {
    return;
  }
  for (const tab of tabs) {
    if (tab.id !== undefined) await syncTab(tab.id, tab.url);
  }
};

chrome.tabs.onActivated.addListener((info) => {
  chrome.tabs.get(info.tabId).then((tab) => syncTab(info.tabId, tab.url)).catch(() => {});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === "complete") syncTab(tabId, tab.url);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.enable(tabId).catch(() => {});
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  chrome.tabs
    .query({ active: true, windowId })
    .then((tabs) => {
      if (tabs[0] && tabs[0].id !== undefined) syncTab(tabs[0].id, tabs[0].url);
    })
    .catch(() => {});
});

chrome.runtime.onInstalled.addListener(syncAll);
chrome.runtime.onStartup.addListener(syncAll);

syncAll();