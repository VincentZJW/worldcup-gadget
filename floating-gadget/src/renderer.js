(function () {
  "use strict";

  const LANGUAGE_STORAGE_KEY = "worldcup-gadget-language";
  const LONG_PRESS_MS = 360;

  const i18n = Object.freeze({
    zh: {
      allMatchesHeading: "前一日全部战况",
      ballTitle: "点击展开 · 长按拖拽 · 右键更多操作",
      ballViewLabel: "世界杯悬浮球",
      cancel: "取消",
      collapse: "收起",
      collapseTitle: "收回悬浮球",
      dashboardReservedHint: "完整 Dashboard 网页接口已预留，当前版本不会打开外部网页，也不会联网。",
      data: "DATA",
      dialogDescription: "你可以退出悬浮球，或预留跳转到完整 dashboard 网页的接口。",
      dialogKicker: "WORLD CUP GADGET",
      draggingBallLabel: "正在拖动世界杯悬浮球",
      exit: "退出",
      exitFloatingBall: "退出悬浮球",
      expandBallLabel: "展开世界杯战报",
      fixturesHeading: "今日赛程",
      floatingBallActions: "悬浮球操作",
      groupFallback: "Group --",
      invalidJson: "战报数据格式错误，请检查 latest.json。",
      languageEn: "EN",
      languageLabel: "语言切换",
      languageZh: "中文",
      latestFinishedMatch: "最新结束比赛",
      latestOnly: "只看最新",
      liveLocalBrief: "本地战报",
      loading: "读取中",
      localJson: "LOCAL JSON",
      newReport: "有新战报",
      newsHeading: "重点新闻",
      noFinishedMatch: "暂无已结束比赛数据",
      noGoals: "无进球",
      notFound: "未找到战报数据，请先生成 data/latest.json。",
      openclawReady: "OPENCLAW READY",
      openDashboardReserved: "查看网页（预留）",
      panelSubtitle: "最新战况 · 北京时间",
      panelTitle: "2026 世界杯战报",
      readingReport: "正在读取本地战报…",
      refresh: "刷新",
      refreshSuccess: "已刷新 · latest.json 数据已重新载入",
      refreshTitle: "重新读取 latest.json",
      reportUnavailable: "本地战报不可用",
      standingsHeading: "小组形势",
      tbd: "待定",
      unknown: "未知",
      unknownPlayer: "未知球员",
      updated: "更新时间",
      venueTbd: "场地待定",
      viewMore: "查看更多"
    },
    en: {
      allMatchesHeading: "All Matches From Previous Day",
      ballTitle: "Click to expand · long press to drag · right click for actions",
      ballViewLabel: "World Cup floating ball",
      cancel: "Cancel",
      collapse: "Collapse",
      collapseTitle: "Collapse to floating ball",
      dashboardReservedHint: "The full dashboard entry is reserved. This version will not open external pages or make network requests.",
      data: "DATA",
      dialogDescription: "You can exit the floating ball or use the reserved entry to open the full dashboard page.",
      dialogKicker: "WORLD CUP GADGET",
      draggingBallLabel: "Dragging World Cup floating ball",
      exit: "Exit",
      exitFloatingBall: "Exit Floating Ball",
      expandBallLabel: "Expand World Cup brief",
      fixturesHeading: "Today's Fixtures",
      floatingBallActions: "Floating Ball Actions",
      groupFallback: "Group --",
      invalidJson: "Report data format error. Please check latest.json.",
      languageEn: "EN",
      languageLabel: "Language",
      languageZh: "中文",
      latestFinishedMatch: "Latest Finished Match",
      latestOnly: "Latest Only",
      liveLocalBrief: "LIVE LOCAL BRIEF",
      loading: "Loading",
      localJson: "LOCAL JSON",
      newReport: "New report available",
      newsHeading: "Top News",
      noFinishedMatch: "No finished match data yet",
      noGoals: "No goals",
      notFound: "Report data not found. Please generate data/latest.json first.",
      openclawReady: "OPENCLAW READY",
      openDashboardReserved: "Open Dashboard (Reserved)",
      panelSubtitle: "Latest Status · Beijing Time",
      panelTitle: "2026 World Cup Brief",
      readingReport: "Reading local report…",
      refresh: "Refresh",
      refreshSuccess: "Refreshed · latest.json has been reloaded",
      refreshTitle: "Reload latest.json",
      reportUnavailable: "Local report unavailable",
      standingsHeading: "Standings Notes",
      tbd: "TBD",
      unknown: "Unknown",
      unknownPlayer: "Unknown player",
      updated: "Updated",
      venueTbd: "Venue TBD",
      viewMore: "View More"
    }
  });

  const ballView = document.getElementById("ball-view");
  const panelView = document.getElementById("panel-view");
  const dialogView = document.getElementById("dialog-view");
  const ballButton = document.getElementById("ball-button");
  const ballBadge = document.querySelector(".ball-badge");
  const collapseButton = document.getElementById("collapse-button");
  const refreshButton = document.getElementById("refresh-button");
  const quitButton = document.getElementById("quit-button");
  const moreButton = document.getElementById("more-button");
  const moreButtonLabel = document.getElementById("more-button-label");
  const latestContainer = document.getElementById("latest-match");
  const allMatchesContainer = document.getElementById("all-matches");
  const allMatchesSection = document.getElementById("all-matches-section");
  const statusMessage = document.getElementById("status-message");
  const summaryCard = document.getElementById("summary-card");
  const updatedAt = document.getElementById("updated-at");
  const matchCount = document.getElementById("match-count");
  const panelLanguageSwitcher = document.getElementById("panel-language-switcher");
  const dialogLanguageSwitcher = document.getElementById("dialog-language-switcher");
  const panelKickerText = document.getElementById("panel-kicker-text");
  const panelTitle = document.getElementById("panel-title");
  const panelSubtitle = document.getElementById("panel-subtitle");
  const latestHeading = document.getElementById("latest-heading");
  const allHeading = document.getElementById("all-heading");
  const localJsonChip = document.getElementById("local-json-chip");
  const dataLabel = document.getElementById("data-label");
  const footerBrand = document.getElementById("footer-brand");
  const reportExtras = document.getElementById("report-extras");
  const standingsCard = document.getElementById("standings-card");
  const standingsHeading = document.getElementById("standings-heading");
  const standingsList = document.getElementById("standings-list");
  const fixturesCard = document.getElementById("fixtures-card");
  const fixturesHeading = document.getElementById("fixtures-heading");
  const fixturesList = document.getElementById("fixtures-list");
  const newsCard = document.getElementById("news-card");
  const newsHeading = document.getElementById("news-heading");
  const newsList = document.getElementById("news-list");
  const dialogKicker = document.getElementById("dialog-kicker");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogDescription = document.getElementById("dialog-description");
  const dialogHint = document.getElementById("dialog-hint");
  const dialogDashboardButton = document.getElementById("dialog-dashboard-button");
  const dialogQuitButton = document.getElementById("dialog-quit-button");
  const dialogCancelButton = document.getElementById("dialog-cancel-button");

  let currentLanguage = getCurrentLanguage();
  let currentReportData = null;
  let currentErrorCode = null;
  let showingAll = false;
  let statusTimer = null;
  let longPressTimer = null;
  let activePointerId = null;
  let pressStartPoint = null;
  let latestPointerPoint = null;
  let draggingBall = false;
  let suppressNextBallClick = false;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function hasText(value) {
    return typeof value === "string" && value.trim();
  }

  function getCurrentLanguage() {
    try {
      return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "zh";
    } catch (_error) {
      return "zh";
    }
  }

  function persistLanguage(lang) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (_error) {
      // The UI still works if localStorage is unavailable.
    }
  }

  function t(key) {
    return i18n[currentLanguage][key] || i18n.zh[key] || key;
  }

  function localizedValue(source, baseKey, lang = currentLanguage, fallback = "") {
    if (!source || typeof source !== "object") return fallback;

    const preferred = source[`${baseKey}_${lang}`];
    if (hasText(preferred)) return preferred;

    const base = source[baseKey];
    if (hasText(base)) return base;

    return fallback;
  }

  function localizedArray(source, baseKey, lang = currentLanguage) {
    if (!source || typeof source !== "object") return [];

    const preferred = source[`${baseKey}_${lang}`];
    if (Array.isArray(preferred)) return preferred;

    const base = source[baseKey];
    if (Array.isArray(base)) return base;

    return [];
  }

  function localizeBeijingTime(value, lang = currentLanguage) {
    if (!hasText(value)) return "";
    const text = String(value);

    if (lang === "en") {
      return text
        .replace(/^北京时间\s*/, "Beijing Time ")
        .replace(/北京时间/g, "Beijing Time");
    }

    if (lang === "zh") {
      return text
        .replace(/^Beijing Time\s*/i, "北京时间 ")
        .replace(/Beijing Time/gi, "北京时间");
    }

    return text;
  }

  function localizedTime(source, baseKey, lang = currentLanguage) {
    if (!source || typeof source !== "object") return "";

    const preferredKey = `${baseKey}_${lang}`;
    if (hasText(source[preferredKey])) {
      return localizeBeijingTime(source[preferredKey], lang);
    }

    return localizeBeijingTime(source[baseKey], lang);
  }

  function renderLanguageSwitcher(container) {
    if (!container) return;

    container.setAttribute("aria-label", t("languageLabel"));
    container.replaceChildren();

    [
      { lang: "zh", label: t("languageZh") },
      { lang: "en", label: t("languageEn") }
    ].forEach((option) => {
      const button = element("button", "language-switcher__button", option.label);
      button.type = "button";
      button.dataset.languageOption = option.lang;
      button.setAttribute("aria-pressed", String(option.lang === currentLanguage));
      if (option.lang === currentLanguage) {
        button.classList.add("language-switcher__button--active");
      }
      button.addEventListener("click", () => setLanguage(option.lang));
      container.append(button);
    });
  }

  function resetMoreButton() {
    moreButton.setAttribute("aria-expanded", String(showingAll));
    moreButtonLabel.textContent = showingAll ? t("latestOnly") : t("viewMore");
    moreButton.querySelector(".more-button__arrow").textContent = showingAll ? "↑" : "↓";
  }

  function applyLanguage(options = {}) {
    const rerenderDynamic = options.rerenderDynamic !== false;

    document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
    document.body.dataset.language = currentLanguage;
    document.body.classList.toggle("lang-zh", currentLanguage === "zh");
    document.body.classList.toggle("lang-en", currentLanguage === "en");
    ballView.setAttribute("aria-label", t("ballViewLabel"));
    ballButton.setAttribute("aria-label", draggingBall ? t("draggingBallLabel") : t("expandBallLabel"));
    ballButton.title = t("ballTitle");
    ballBadge?.setAttribute("aria-label", t("newReport"));
    ballBadge?.setAttribute("title", t("newReport"));
    panelView.setAttribute("aria-label", t("panelTitle"));

    panelKickerText.textContent = t("liveLocalBrief");
    panelTitle.textContent = t("panelTitle");
    panelSubtitle.textContent = t("panelSubtitle");
    latestHeading.textContent = t("latestFinishedMatch");
    allHeading.textContent = t("allMatchesHeading");
    localJsonChip.textContent = t("localJson");
    dataLabel.textContent = t("data");
    footerBrand.textContent = t("openclawReady");
    standingsHeading.textContent = t("standingsHeading");
    fixturesHeading.textContent = t("fixturesHeading");
    newsHeading.textContent = t("newsHeading");

    refreshButton.textContent = refreshButton.disabled ? t("loading") : t("refresh");
    refreshButton.title = t("refreshTitle");
    collapseButton.textContent = t("collapse");
    collapseButton.title = t("collapseTitle");
    quitButton.textContent = t("exit");
    quitButton.title = t("exitFloatingBall");
    resetMoreButton();

    dialogView.setAttribute("aria-label", t("floatingBallActions"));
    dialogKicker.textContent = t("dialogKicker");
    dialogTitle.textContent = t("floatingBallActions");
    dialogDescription.textContent = t("dialogDescription");
    dialogDashboardButton.textContent = t("openDashboardReserved");
    dialogQuitButton.textContent = t("exitFloatingBall");
    dialogCancelButton.textContent = t("cancel");
    if (!dialogHint.hidden) dialogHint.textContent = t("dashboardReservedHint");

    renderLanguageSwitcher(panelLanguageSwitcher);
    renderLanguageSwitcher(dialogLanguageSwitcher);

    if (!rerenderDynamic) return;
    if (currentReportData) {
      renderReport(currentReportData);
    } else if (currentErrorCode) {
      updateErrorDisplay();
    } else {
      updatedAt.textContent = t("readingReport");
    }
  }

  function setLanguage(lang) {
    if (lang !== "zh" && lang !== "en") return;
    if (lang === currentLanguage) return;

    currentLanguage = lang;
    persistLanguage(lang);
    applyLanguage({ rerenderDynamic: true });
  }

  function pointerPoint(event) {
    return {
      screenX: Math.round(event.screenX),
      screenY: Math.round(event.screenY)
    };
  }

  function clearLongPressTimer() {
    if (!longPressTimer) return;
    window.clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  function setBallDraggingVisualState(isDragging) {
    ballView.classList.toggle("ball-view--pressing", Boolean(pressStartPoint && !isDragging));
    ballView.classList.toggle("ball-view--dragging", isDragging);
    ballButton.setAttribute(
      "aria-label",
      isDragging ? t("draggingBallLabel") : t("expandBallLabel")
    );
  }

  function resetBallPointerState() {
    clearLongPressTimer();
    activePointerId = null;
    pressStartPoint = null;
    latestPointerPoint = null;
    draggingBall = false;
    setBallDraggingVisualState(false);
  }

  async function beginBallDrag() {
    if (!pressStartPoint || draggingBall) return;

    draggingBall = true;
    suppressNextBallClick = true;
    setBallDraggingVisualState(true);

    try {
      await window.gadgetAPI.startWindowDrag(latestPointerPoint || pressStartPoint);
    } catch (_error) {
      resetBallPointerState();
      suppressNextBallClick = false;
    }
  }

  function onBallPointerDown(event) {
    if (event.button !== 0 || document.body.dataset.mode !== "ball") return;

    activePointerId = event.pointerId;
    pressStartPoint = pointerPoint(event);
    latestPointerPoint = pressStartPoint;
    setBallDraggingVisualState(false);

    try {
      ballButton.setPointerCapture(event.pointerId);
    } catch (_error) {
      // Pointer capture is a convenience here; custom drag still works without it.
    }

    clearLongPressTimer();
    longPressTimer = window.setTimeout(() => {
      longPressTimer = null;
      beginBallDrag();
    }, LONG_PRESS_MS);
  }

  function onBallPointerMove(event) {
    if (activePointerId !== event.pointerId || !pressStartPoint) return;

    latestPointerPoint = pointerPoint(event);
    if (!draggingBall) return;

    event.preventDefault();
    window.gadgetAPI.moveWindowDrag(latestPointerPoint);
  }

  function onBallPointerEnd(event) {
    if (activePointerId !== event.pointerId) return;

    const wasDragging = draggingBall;
    clearLongPressTimer();

    if (wasDragging) {
      event.preventDefault();
      window.gadgetAPI.endWindowDrag().catch(() => {});
    }

    try {
      ballButton.releasePointerCapture(event.pointerId);
    } catch (_error) {
      // It is fine if capture was already released by the browser.
    }

    resetBallPointerState();

    if (wasDragging) {
      window.setTimeout(() => {
        suppressNextBallClick = false;
      }, 140);
    }
  }

  async function showBallActions(event) {
    event.preventDefault();
    clearLongPressTimer();
    if (draggingBall) {
      await window.gadgetAPI.endWindowDrag().catch(() => {});
    }
    resetBallPointerState();
    suppressNextBallClick = false;
    dialogHint.hidden = true;

    if (typeof window.gadgetAPI.showActionsWindow === "function") {
      await window.gadgetAPI.showActionsWindow();
    } else {
      await window.gadgetAPI.expandWindow();
    }

    document.body.dataset.mode = "dialog";
    ballView.hidden = true;
    panelView.hidden = true;
    dialogView.hidden = false;
    applyLanguage({ rerenderDynamic: false });
  }

  async function closeBallActionsDialog() {
    dialogView.hidden = true;
    panelView.hidden = true;
    ballView.hidden = false;
    document.body.dataset.mode = "ball";
    dialogHint.hidden = true;
    resetBallPointerState();
    await window.gadgetAPI.collapseWindow();
  }

  function normalizeTeam(team) {
    const source = team && typeof team === "object" ? team : {};
    const legacyName = typeof team === "string" ? team : "";
    const hasScore = source.score !== null && source.score !== undefined && source.score !== "";
    return {
      name: localizedValue(source, "name", currentLanguage, legacyName || t("tbd")),
      flag: source.flag || "🏳️",
      score: hasScore && Number.isFinite(Number(source.score)) ? Number(source.score) : "–",
      scorers: asArray(source.scorers)
    };
  }

  function scorerText(scorer) {
    const player = localizedValue(scorer, "player", currentLanguage, t("unknownPlayer"));
    const minute = scorer && scorer.minute ? ` ${scorer.minute}` : "";
    const suffix = scorer && scorer.type === "penalty"
      ? " (P)"
      : scorer && scorer.type === "own_goal"
        ? " (OG)"
        : "";
    return `${player}${minute}${suffix}`;
  }

  function latestFinishedMatch(matches) {
    const validMatches = asArray(matches).filter((match) => match && typeof match === "object");
    const timedMatches = validMatches.filter(
      (match) => typeof match.finished_at_bj === "string" && match.finished_at_bj.trim()
    );

    if (timedMatches.length) {
      return [...timedMatches].sort((a, b) =>
        a.finished_at_bj.localeCompare(b.finished_at_bj, "zh-CN")
      )[timedMatches.length - 1];
    }

    return validMatches[validMatches.length - 1] || null;
  }

  function createScorerList(team, align) {
    const list = element("div", `scorer-list scorer-list--${align}`);
    if (!team.scorers.length) {
      list.append(element("span", "scorer scorer--empty", t("noGoals")));
      return list;
    }
    team.scorers.forEach((scorer) => list.append(element("span", "scorer", scorerText(scorer))));
    return list;
  }

  function createTeam(team, align) {
    const wrapper = element("div", `team team--${align}`);
    wrapper.append(
      element("span", "team__flag", team.flag),
      element("span", "team__name", team.name)
    );
    return wrapper;
  }

  function createMatchCard(match, featured) {
    const teamA = normalizeTeam(match.team_a);
    const teamB = normalizeTeam(match.team_b);
    const card = element("article", `match-card${featured ? " match-card--featured" : ""}`);

    const meta = element("div", "match-meta");
    const metaLeft = element("div", "match-meta__left");
    metaLeft.append(
      element("span", "group-label", match.group || t("groupFallback")),
      element("span", "venue-label", localizedValue(match, "venue", currentLanguage, t("venueTbd")))
    );
    const finishedTime = localizedTime(match, "finished_at_bj", currentLanguage);
    if (finishedTime) {
      metaLeft.append(element("span", "finished-label", finishedTime));
    }
    const status = String(match.status || t("tbd"));
    const statusKey = status.toLowerCase() === "live" ? "live" : "default";
    meta.append(metaLeft, element("span", `status-badge status-badge--${statusKey}`, status));

    const scoreRow = element("div", "score-row");
    scoreRow.append(
      createTeam(teamA, "left"),
      element("span", "score-value", `${teamA.score} - ${teamB.score}`),
      createTeam(teamB, "right")
    );

    const scorers = element("div", "scorers-grid");
    scorers.append(createScorerList(teamA, "left"), createScorerList(teamB, "right"));
    card.append(meta, scoreRow, scorers);

    const highlights = localizedArray(match, "highlights").slice(0, 2);
    if (highlights.length) {
      const list = element("ul", "highlights");
      highlights.forEach((highlight) => list.append(element("li", "", highlight)));
      card.append(list);
    }

    return card;
  }

  function renderStandings(data) {
    const standings = localizedArray(data, "standings_changes");
    standingsList.replaceChildren();
    standings.forEach((item) => standingsList.append(element("li", "", item)));
    standingsCard.hidden = standings.length === 0;
    return standings.length;
  }

  function renderFixtures(data) {
    const fixtures = asArray(data.today_fixtures).filter((item) => item && typeof item === "object");
    fixturesList.replaceChildren();
    fixtures.forEach((fixture) => {
      const teamA = normalizeTeam(fixture.team_a);
      const teamB = normalizeTeam(fixture.team_b);
      const localizedFixtureTime = localizedTime(fixture, "time_bj", currentLanguage);
      const time = localizedFixtureTime ? `${localizedFixtureTime} · ` : "";
      const group = hasText(fixture.group) ? `${fixture.group} · ` : "";
      fixturesList.append(
        element("li", "", `${time}${group}${teamA.flag} ${teamA.name} vs ${teamB.flag} ${teamB.name}`)
      );
    });
    fixturesCard.hidden = fixtures.length === 0;
    return fixtures.length;
  }

  function renderNews(data) {
    const news = asArray(data.news).filter((item) => item && typeof item === "object");
    newsList.replaceChildren();
    news.forEach((item) => {
      const title = localizedValue(item, "title", currentLanguage, t("unknown"));
      const source = hasText(item.source) ? ` · ${item.source}` : "";
      newsList.append(element("li", "", `${title}${source}`));
    });
    newsCard.hidden = news.length === 0;
    return news.length;
  }

  function updateErrorDisplay() {
    if (statusTimer) window.clearTimeout(statusTimer);
    showingAll = false;
    allMatchesSection.hidden = true;
    resetMoreButton();
    statusMessage.textContent = currentErrorCode === "INVALID_JSON"
      ? t("invalidJson")
      : t("notFound");
    statusMessage.className = "status-message status-message--error";
    statusMessage.hidden = false;
    summaryCard.hidden = true;
    latestContainer.replaceChildren();
    allMatchesContainer.replaceChildren();
    standingsList.replaceChildren();
    fixturesList.replaceChildren();
    newsList.replaceChildren();
    reportExtras.hidden = true;
    moreButton.hidden = true;
    updatedAt.textContent = t("reportUnavailable");
  }

  function setError(code) {
    currentReportData = null;
    currentErrorCode = code;
    updateErrorDisplay();
  }

  function showRefreshSuccess() {
    if (statusTimer) window.clearTimeout(statusTimer);
    statusMessage.textContent = t("refreshSuccess");
    statusMessage.className = "status-message status-message--success";
    statusMessage.hidden = false;
    statusTimer = window.setTimeout(() => {
      statusMessage.hidden = true;
      statusTimer = null;
    }, 1600);
  }

  function renderReport(data) {
    currentReportData = data;
    currentErrorCode = null;

    const matches = asArray(data.matches);
    const latest = latestFinishedMatch(matches);
    const summary = localizedValue(data, "summary", currentLanguage, "");

    statusMessage.hidden = true;
    updatedAt.textContent = `${t("updated")} · ${localizedTime(data, "updated_at", currentLanguage) || t("unknown")}`;
    latestContainer.replaceChildren();
    allMatchesContainer.replaceChildren();
    matchCount.textContent = `${matches.length} MATCHES`;

    if (summary) {
      summaryCard.textContent = summary;
      summaryCard.hidden = false;
    } else {
      summaryCard.hidden = true;
    }

    if (latest) {
      latestContainer.append(createMatchCard(latest, true));
    } else {
      latestContainer.append(element("div", "empty-state", t("noFinishedMatch")));
    }

    matches.forEach((match) => allMatchesContainer.append(createMatchCard(match, false)));
    moreButton.hidden = matches.length === 0;

    const standingsCount = renderStandings(data);
    const fixturesCount = renderFixtures(data);
    const newsCount = renderNews(data);
    reportExtras.hidden = standingsCount + fixturesCount + newsCount === 0;
  }

  async function readReport(method) {
    refreshButton.disabled = true;
    refreshButton.textContent = t("loading");
    try {
      const result = await window.gadgetAPI[method]();
      if (!result || !result.ok) {
        setError(result && result.error);
        return;
      }
      renderReport(result.data);
      if (method === "refreshReport") showRefreshSuccess();
    } catch (_error) {
      setError("READ_FAILED");
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = t("refresh");
    }
  }

  async function expandPanel() {
    await window.gadgetAPI.expandWindow();
    document.body.dataset.mode = "panel";
    ballView.hidden = true;
    dialogView.hidden = true;
    panelView.hidden = false;
    await readReport("readLatestReport");
  }

  async function collapsePanel() {
    showingAll = false;
    resetMoreButton();
    allMatchesSection.hidden = true;
    dialogView.hidden = true;
    panelView.hidden = true;
    ballView.hidden = false;
    document.body.dataset.mode = "ball";
    await window.gadgetAPI.collapseWindow();
  }

  function showBallOnly() {
    showingAll = false;
    resetMoreButton();
    allMatchesSection.hidden = true;
    dialogView.hidden = true;
    panelView.hidden = true;
    ballView.hidden = false;
    document.body.dataset.mode = "ball";
    resetBallPointerState();
  }

  function toggleAllMatches() {
    showingAll = !showingAll;
    allMatchesSection.hidden = !showingAll;
    resetMoreButton();
  }

  async function quitApp() {
    await window.gadgetAPI.quitApp();
  }

  ballButton.addEventListener("pointerdown", onBallPointerDown);
  ballButton.addEventListener("pointermove", onBallPointerMove);
  ballButton.addEventListener("pointerup", onBallPointerEnd);
  ballButton.addEventListener("pointercancel", onBallPointerEnd);
  ballButton.addEventListener("lostpointercapture", () => {
    if (!draggingBall) resetBallPointerState();
  });
  ballView.addEventListener("contextmenu", showBallActions);
  ballButton.addEventListener("click", (event) => {
    if (suppressNextBallClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressNextBallClick = false;
      return;
    }
    expandPanel();
  });
  collapseButton.addEventListener("click", collapsePanel);
  refreshButton.addEventListener("click", () => readReport("refreshReport"));
  quitButton.addEventListener("click", quitApp);
  moreButton.addEventListener("click", toggleAllMatches);
  dialogDashboardButton.addEventListener("click", () => {
    dialogHint.textContent = t("dashboardReservedHint");
    dialogHint.hidden = false;
  });
  dialogQuitButton.addEventListener("click", quitApp);
  dialogCancelButton.addEventListener("click", closeBallActionsDialog);
  window.gadgetAPI.onShortcutShowBall(showBallOnly);

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (document.body.dataset.mode === "dialog") {
      closeBallActionsDialog();
      return;
    }
    if (document.body.dataset.mode === "panel") collapsePanel();
  });

  applyLanguage({ rerenderDynamic: false });
})();
