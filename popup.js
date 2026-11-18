// TeamX - AdBlock (MIT)
// https://github.com/shadow-x78/teamx-adblock

(() => {
  "use strict";

  const MANIFEST = chrome.runtime.getManifest();
  const { storage, siteHost, coerceEnabled } = TeamXContract;
  const { keys, defaults } = storage;

  const RULESET_ID = MANIFEST.declarative_net_request.rule_resources[0].id;

  const onSite = (tab) => {
    try {
      return new URL(tab.url).hostname === siteHost || new URL(tab.url).hostname.endsWith("." + siteHost);
    } catch (_) {
      return false;
    }
  };

  const STRINGS = {
    ar: {
      lang: "ar",
      dir: "rtl",
      title: "TeamX AdBlock",
      on: "نشط",
      off: "متوقف",
      caption: "إعلان محجوب",
      control: "الحماية",
      hintOn: (host) => `تحجب الإعلانات على ${host}`,
      hintOff: "معطّلة — ستظهر الإعلانات",
      repo: "المستودع على GitHub",
      update: "التحقق من التحديث",
      updateBusy: "جارٍ التحقق…",
      updateCurrent: "أنت على أحدث إصدار",
      updateAvailable: (v) => `يتوفر ${v}`,
      updateFailed: "تعذّر التحقق",
      copyright: (year, author) => `حقوق النشر © ${year} ${author}`,
    },
    en: {
      lang: "en",
      dir: "ltr",
      title: "TeamX AdBlock",
      on: "Active",
      off: "Paused",
      caption: "ads blocked",
      control: "Protection",
      hintOn: (host) => `Blocking ads on ${host}`,
      hintOff: "Paused — ads will show",
      repo: "View on GitHub",
      update: "Check for updates",
      updateBusy: "Checking…",
      updateCurrent: "You are up to date",
      updateAvailable: (v) => `${v} available`,
      updateFailed: "Check failed",
      copyright: (year, author) => `Copyright © ${year} ${author}`,
    }
  };

  const DEFAULT_LANG = defaults.lang;

  const $ = (id) => document.getElementById(id);
  const nodes = {
    status: $("status"),
    statusText: $("statusText"),
    total: $("blockedTotal"),
    caption: $("blockedCaption"),
    toggle: $("toggle"),
    controlTitle: $("controlTitle"),
    hint: $("controlHint"),
    langGroup: $("langGroup"),
    update: $("update"),
    updateText: $("updateText"),
    repo: $("repo"),
    repoText: $("repoText"),
    copyright: $("copyright"),
    version: $("version")
  };

  const number = new Intl.NumberFormat("en-US");
  const formatCount = (value) => number.format(Math.max(0, Number(value) || 0));
  const strings = () => STRINGS[state.lang] || STRINGS[DEFAULT_LANG];

  const state = {
    lang: DEFAULT_LANG,
    enabled: defaults.enabled,
    pageBlocked: 0
  };

  const applyLanguage = () => {
    const t = strings();

    document.documentElement.lang = t.lang;
    document.documentElement.dir = t.dir;
    document.title = t.title;

    nodes.caption.textContent = t.caption;
    nodes.controlTitle.textContent = t.control;
    nodes.repoText.textContent = t.repo;
    if (!nodes.update.dataset.state || nodes.update.dataset.state === "idle") {
      nodes.updateText.textContent = t.update;
    }
    nodes.copyright.textContent = t.copyright(new Date().getFullYear(), MANIFEST.author);

    for (const button of nodes.langGroup.querySelectorAll("[data-lang]")) {
      button.setAttribute("aria-pressed", button.dataset.lang === state.lang ? "true" : "false");
    }
  };

  const renderStatus = () => {
    const t = strings();
    nodes.status.dataset.state = state.enabled ? "on" : "off";
    nodes.statusText.textContent = state.enabled ? t.on : t.off;
    nodes.hint.textContent = state.enabled ? t.hintOn(siteHost) : t.hintOff;
  };

  const renderCounter = () => {
    nodes.total.textContent = formatCount(state.pageBlocked);
  };

  const readPageCounter = (callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (chrome.runtime.lastError || !tab || tab.id === undefined) {
        callback();
        return;
      }
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          func: () => {
            const root = document.documentElement;
            return root ? parseInt(root.getAttribute("data-teamx-blocked") || "0", 10) || 0 : 0;
          }
        })
        .then((results) => {
          const value = results && results[0] ? results[0].result : 0;
          state.pageBlocked = Number(value) || 0;
          callback();
        })
        .catch(() => callback());
    });
  };

  const render = () => {
    nodes.toggle.setAttribute("aria-checked", state.enabled ? "true" : "false");
    renderStatus();
    renderCounter();
  };

  const rulesetIsOn = async () => {
    try {
      return (await chrome.declarativeNetRequest.getEnabledRulesets()).includes(RULESET_ID);
    } catch (_) {
      return null;
    }
  };

  const setRulesetEnabled = async (enabled) => {
    try {
      const current = await chrome.declarativeNetRequest.getEnabledRulesets();
      const isOn = current.includes(RULESET_ID);
      if (enabled === isOn) return true;
      await chrome.declarativeNetRequest.updateEnabledRulesets(
        enabled ? { enableRulesetIds: [RULESET_ID] } : { disableRulesetIds: [RULESET_ID] }
      );
      return true;
    } catch (_) {
      return false;
    }
  };

  nodes.toggle.addEventListener("click", async () => {
    state.enabled = !state.enabled;

    nodes.toggle.disabled = true;
    nodes.toggle.setAttribute("aria-checked", state.enabled ? "true" : "false");
    renderStatus();

    try {
      await chrome.storage.local.set({ [keys.enabled]: state.enabled });

      if (!(await setRulesetEnabled(state.enabled))) {
        state.enabled = !state.enabled;
        await chrome.storage.local.set({ [keys.enabled]: state.enabled });
        render();
      }

      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.id !== undefined && onSite(tab)) chrome.tabs.reload(tab.id);
      }
    } catch (_) {

    } finally {
      nodes.toggle.disabled = false;
    }
  });

  nodes.langGroup.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-lang]");
    if (!button) return;

    const next = button.dataset.lang;
    if (!STRINGS[next] || next === state.lang) return;

    state.lang = next;
    await chrome.storage.local.set({ [keys.lang]: next });

    applyLanguage();
    render();
  });

  const UPDATE_URL = "https://raw.githubusercontent.com/shadow-x78/teamx-adblock/main/updates.xml";

  const setUpdateState = (state, text) => {
    nodes.update.dataset.state = state;
    nodes.updateText.textContent = text;
    nodes.update.disabled = state === "busy";
  };

  const parseVersion = (value) => {
    const parts = String(value).replace(/^v/i, "").split(".").map((n) => parseInt(n, 10) || 0);
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  };

  const isNewer = (remote, local) => {
    const a = parseVersion(remote);
    const b = parseVersion(local);
    for (let i = 0; i < 3; i += 1) {
      if (a[i] !== b[i]) return a[i] > b[i];
    }
    return false;
  };

  const checkForUpdate = async () => {
    const t = strings();
    setUpdateState("busy", t.updateBusy);

    try {
      const response = await fetch(UPDATE_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("http " + response.status);
      const text = await response.text();
      const match = /<updatecheck[^>]*\sversion='([^']+)'/.exec(text);
      if (!match) throw new Error("no version in manifest");

      const remote = match[1];
      if (isNewer(remote, MANIFEST.version)) {
        setUpdateState("available", t.updateAvailable("v" + remote));
        return;
      }
      setUpdateState("current", t.updateCurrent);
    } catch (_) {
      setUpdateState("failed", t.updateFailed);
    }
  };

  nodes.update.addEventListener("click", () => {
    if (nodes.update.dataset.state === "busy") return;
    if (nodes.update.dataset.state === "available") {
      const url = MANIFEST.homepage_url + "/releases/latest";
      chrome.tabs.create({ url });
      return;
    }
    checkForUpdate();
  });

  nodes.repo.addEventListener("click", () => {
    const url = MANIFEST.homepage_url;
    if (url) chrome.tabs.create({ url });
  });

  nodes.version.textContent = `v${MANIFEST.version}`;

  const query = () => ({
    [keys.lang]: defaults.lang,
    [keys.enabled]: defaults.enabled
  });

  const readState = (callback) => {
    chrome.storage.local.get(query(), (stored) => {
      if (!chrome.runtime.lastError && stored) {
        if (STRINGS[stored[keys.lang]]) state.lang = stored[keys.lang];
        state.enabled = coerceEnabled(stored[keys.enabled]);
      }
      callback();
    });
  };

  readState(() => {
    applyLanguage();
    render();

    readPageCounter(() => renderCounter());

    setRulesetEnabled(state.enabled)
      .then(async (healed) => {
        if (healed) return;
        const actual = await rulesetIsOn();
        if (actual === null || actual === state.enabled) return;
        state.enabled = actual;
        await chrome.storage.local.set({ [keys.enabled]: actual });
        render();
      })
      .finally(() => {
        nodes.toggle.disabled = false;
      });
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (!Object.keys(keys).some((name) => changes[keys[name]])) return;

    readState(() => {
      applyLanguage();
      render();
    });
  });

  const counterTimer = setInterval(() => {
    readPageCounter(() => renderCounter());
  }, 1000);

  window.addEventListener("pagehide", () => clearInterval(counterTimer));
})();
