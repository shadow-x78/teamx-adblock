// TeamX - AdBlock (MIT) — popup

(() => {
  "use strict";

  const MANIFEST = chrome.runtime.getManifest();
  const { storage, siteHost, dayKey, coerceEnabled } = TeamXContract;
  const { keys, defaults } = storage;

  // The manifest owns the ruleset id, so read it there instead of restating it.
  const RULESET_ID = MANIFEST.declarative_net_request.rule_resources[0].id;

  // Tabs are filtered through the contract's host rule rather than repeating
  // the manifest's match patterns here.
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
      today: (n) => `اليوم: ${n}`,
      control: "الحماية",
      hintOn: (host) => `تحجب الإعلانات على ${host}`,
      hintOff: "معطّلة — ستظهر الإعلانات",
      repo: "المستودع على GitHub",
      copyright: (year, author) => `حقوق النشر © ${year} ${author}`,
    },
    en: {
      lang: "en",
      dir: "ltr",
      title: "TeamX AdBlock",
      on: "Active",
      off: "Paused",
      caption: "ads blocked",
      today: (n) => `Today: ${n}`,
      control: "Protection",
      hintOn: (host) => `Blocking ads on ${host}`,
      hintOff: "Paused — ads will show",
      repo: "View on GitHub",
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
    today: $("blockedToday"),
    toggle: $("toggle"),
    controlTitle: $("controlTitle"),
    hint: $("controlHint"),
    langGroup: $("langGroup"),
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
    blockedTotal: defaults.blockedTotal,
    blockedToday: defaults.blockedToday,
    blockedDay: defaults.blockedDay
  };

  const applyLanguage = () => {
    const t = strings();

    document.documentElement.lang = t.lang;
    document.documentElement.dir = t.dir;
    document.title = t.title;

    nodes.caption.textContent = t.caption;
    nodes.controlTitle.textContent = t.control;
    nodes.repoText.textContent = t.repo;
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
    const t = strings();
    nodes.total.textContent = formatCount(state.blockedTotal);
    const todayCount = state.blockedDay === dayKey() ? state.blockedToday || 0 : 0;
    nodes.today.textContent = t.today(formatCount(todayCount));
  };

  const render = () => {
    nodes.toggle.setAttribute("aria-checked", state.enabled ? "true" : "false");
    renderStatus();
    renderCounter();
  };

  // Returns whether the ruleset now matches `enabled`. The caller decides what
  // to show; a silent failure would let the panel claim "Active" while network
  // blocking is off.
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

      // If the ruleset could not be switched, put the control back where it was so
      // the panel never claims protection it does not have.
      if (!(await setRulesetEnabled(state.enabled))) {
        state.enabled = !state.enabled;
        await chrome.storage.local.set({ [keys.enabled]: state.enabled });
        render();
      }

      // Reload open site tabs so the page-context defenses are (un)installed.
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.id !== undefined && onSite(tab)) chrome.tabs.reload(tab.id);
      }
    } catch (_) {
      // The extension context can be invalidated while the panel is open; the
      // switch must never stay disabled with no way to interact.
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

  nodes.repo.addEventListener("click", () => {
    const url = MANIFEST.homepage_url;
    if (url) chrome.tabs.create({ url });
  });

  nodes.version.textContent = `v${MANIFEST.version}`;

  // Read the whole state through the contract's key/default table so the popup
  // and the bridge can never disagree about a key name or a default.
  const query = () => ({
    [keys.lang]: defaults.lang,
    [keys.enabled]: defaults.enabled,
    [keys.total]: defaults.blockedTotal,
    [keys.today]: defaults.blockedToday,
    [keys.day]: defaults.blockedDay
  });

  const readState = (callback) => {
    chrome.storage.local.get(query(), (stored) => {
      if (!chrome.runtime.lastError && stored) {
        if (STRINGS[stored[keys.lang]]) state.lang = stored[keys.lang];
        state.enabled = coerceEnabled(stored[keys.enabled]);
        state.blockedTotal = stored[keys.total] || 0;
        state.blockedToday = stored[keys.today] || 0;
        state.blockedDay = stored[keys.day] || "";
      }
      callback();
    });
  };

  readState(() => {
    applyLanguage();
    render();

    // Heal a ruleset that drifted from the stored state. If it will not follow
    // the stored intent, adopt what it actually is *and persist that*, because
    // every later storage read (each counter flush) re-reads `enabled` and would
    // otherwise flip the panel back to the state the ruleset is not in.
    //
    // The switch stays disabled until this settles, so a click cannot race the
    // heal and be overridden by it (or override the toggle's own revert).
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

  // Live updates while the popup stays open. Re-reading the whole state keeps
  // one path for "something changed" instead of one branch per key.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (!Object.keys(keys).some((name) => changes[keys[name]])) return;

    readState(() => {
      applyLanguage();
      render();
    });
  });
})();
