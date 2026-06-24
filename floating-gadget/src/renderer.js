(function () {
  "use strict";

  const LANGUAGE_STORAGE_KEY = "worldcup-gadget-language";
  const ONBOARDING_STORAGE_KEY = "worldcup-gadget-onboarding-dismissed";
  const DAILY_SHOW_ENABLED_STORAGE_KEY = "worldcup-gadget-daily-show-enabled";
  const DAILY_SHOW_TIME_STORAGE_KEY = "worldcup-gadget-daily-show-time";
  const DEFAULT_DAILY_SHOW_TIME = "10:00";
  const DAILY_AUTO_SHOW_RETRY_MS = 15 * 60 * 1000;
  const DATA_STALE_HOURS = 36;
  const DATA_STALE_MS = DATA_STALE_HOURS * 60 * 60 * 1000;
  const LONG_PRESS_MS = 360;

  const i18n = Object.freeze({
    zh: {
      allMatchesHeading: "前一日全部战况",
      autoRefreshError: "检测到 latest.json 变化，但重新读取失败。",
      autoRefreshSuccess: "latest.json 已更新，战报已自动刷新。",
      ballTitle: "点击展开 · 长按拖拽",
      ballViewLabel: "世界杯悬浮球",
      collapse: "收起",
      collapseTitle: "收回悬浮球",
      data: "DATA",
      dataHealthCurrent: "数据正常",
      dataHealthCurrentDetail: "最后成功读取：{readTime} · {updatedTime} · {count} 场比赛",
      dataHealthFileMissing: "文件缺失",
      dataHealthInvalid: "格式异常",
      dataHealthInvalidDetail: "latest.json 无法解析或结构异常：{path}",
      dataHealthIssueMatchesMissing: "matches 必须是数组",
      dataHealthIssueReportRoot: "latest.json 根节点必须是对象",
      dataHealthIssueTeamsMissing: "部分比赛缺少球队信息",
      dataHealthIssueUpdatedAtMissing: "缺少可识别的更新时间",
      dataHealthMissingDetail: "未找到 latest.json：{path}",
      dataHealthPending: "等待读取",
      dataHealthPendingDetail: "正在读取 latest.json。",
      dataHealthReadFailedDetail: "无法读取 latest.json：{path}",
      dataHealthStale: "数据可能过期",
      dataHealthStaleDetail: "更新时间超过 {hours} 小时：{time}",
      dataHealthTitle: "本地数据状态",
      dataHealthUnknown: "状态未知",
      dataHealthUnknownDetail: "已读取本地数据，但更新时间不可识别。",
      dataHealthUpdatedFromFile: "文件修改时间：{time}",
      dataHealthUpdatedFromReport: "战报更新时间：{time}",
      draggingBallLabel: "正在拖动世界杯悬浮球",
      exit: "退出",
      exitFloatingBall: "退出悬浮球",
      expandBallLabel: "展开世界杯战报",
      fixturesHeading: "今日赛程",
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
      onboardingDismiss: "知道了",
      onboardingDragText: "按住小足球约 0.4 秒后拖动，可以把它放到更顺手的位置。",
      onboardingDragTitle: "长按拖动位置",
      onboardingFooterNote: "之后可在面板里切换语言、刷新数据或退出应用。",
      onboardingKicker: "WORLD CUP GADGET",
      onboardingLocalText: "战报从本地 latest.json 读取，前端不会请求远程比赛 API。",
      onboardingLocalTitle: "本地数据，不走网络接口",
      onboardingMorningText: "每日自动展示可在设置里开启和调整，默认关闭，不会主动打扰你。",
      onboardingMorningTitle: "早上 10 点展示",
      onboardingOpenText: "展开后可以查看比分、旗帜、进球球员、进球时间和全部比赛。",
      onboardingOpenTitle: "点击小足球打开战报",
      onboardingStepsLabel: "使用方式",
      onboardingSubtitle: "第一次使用只需要记住这几件事，之后它会安静地停在桌面边缘。",
      onboardingTitle: "你的世界杯悬浮球已准备好",
      onboardingViewLabel: "首次使用引导",
      openclawReady: "OPENCLAW READY",
      panelSubtitle: "最新战况 · 北京时间",
      panelTitle: "2026 世界杯战报",
      readingReport: "正在读取本地战报…",
      refresh: "刷新",
      refreshSuccess: "已刷新 · latest.json 数据已重新载入",
      refreshTitle: "重新读取 latest.json",
      reportUnavailable: "本地战报不可用",
      settings: "设置",
      settingsBack: "返回",
      settingsBackTitle: "返回战报",
      settingsDataButton: "重新读取",
      settingsDataDescription: "重新读取 latest.json，不请求网络接口。",
      settingsDataHeading: "本地数据",
      settingsDailyDescription: "每天在指定时间自动展开战报面板，默认关闭。",
      settingsDailyHeading: "每日自动展示",
      settingsDailyStatusDisabled: "已关闭",
      settingsDailyStatusEnabled: "已开启 · 每天 {time}",
      settingsDailyStatusFailed: "设置异常 · 无法保存本地偏好",
      settingsDailyTimeLabel: "展示时间",
      settingsDailyToggleLabel: "开启",
      settingsDailyUpdated: "每日自动展示设置已更新。",
      settingsDiagnosticsButton: "复制诊断",
      settingsDiagnosticsDescription: "复制版本、平台、数据路径和当前状态。",
      settingsDiagnosticsHeading: "诊断信息",
      settingsDiagnosticsStatusError: "诊断信息复制失败。",
      settingsDiagnosticsStatusSuccess: "诊断信息已复制到剪贴板。",
      settingsGuideButton: "重新显示",
      settingsGuideDescription: "重新查看小足球的基本用法。",
      settingsGuideHeading: "首次使用引导",
      settingsKicker: "WORLD CUP GADGET",
      settingsLanguageDescription: "切换悬浮球界面语言。",
      settingsLanguageHeading: "语言",
      settingsOpenTitle: "打开设置",
      settingsPositionButton: "重置位置",
      settingsPositionDescription: "把当前窗口移回屏幕右侧默认位置。",
      settingsPositionHeading: "窗口位置",
      settingsQuitButton: "退出",
      settingsQuitDescription: "关闭悬浮球和后台进程。",
      settingsQuitHeading: "退出应用",
      settingsStatusDataError: "数据读取失败，请检查 latest.json。",
      settingsStatusDataSuccess: "本地数据已重新读取。",
      settingsStatusPosition: "窗口位置已重置。",
      settingsSubtitle: "管理悬浮球、自动展示、语言和本地数据。",
      settingsTitle: "设置",
      settingsViewLabel: "设置",
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
      autoRefreshError: "latest.json changed, but the reload failed.",
      autoRefreshSuccess: "latest.json changed. The brief refreshed automatically.",
      ballTitle: "Click to expand · long press to drag",
      ballViewLabel: "World Cup floating ball",
      collapse: "Collapse",
      collapseTitle: "Collapse to floating ball",
      data: "DATA",
      dataHealthCurrent: "Data OK",
      dataHealthCurrentDetail: "Last successful read: {readTime} · {updatedTime} · {count} matches",
      dataHealthFileMissing: "File Missing",
      dataHealthInvalid: "Invalid Format",
      dataHealthInvalidDetail: "latest.json could not be parsed or has an invalid structure: {path}",
      dataHealthIssueMatchesMissing: "matches must be an array",
      dataHealthIssueReportRoot: "latest.json root must be an object",
      dataHealthIssueTeamsMissing: "Some matches are missing team data",
      dataHealthIssueUpdatedAtMissing: "No readable update time",
      dataHealthMissingDetail: "latest.json was not found: {path}",
      dataHealthPending: "Waiting",
      dataHealthPendingDetail: "Reading latest.json.",
      dataHealthReadFailedDetail: "Could not read latest.json: {path}",
      dataHealthStale: "May Be Stale",
      dataHealthStaleDetail: "Update time is over {hours} hours old: {time}",
      dataHealthTitle: "Local Data Status",
      dataHealthUnknown: "Unknown",
      dataHealthUnknownDetail: "Local data was read, but the update time is not readable.",
      dataHealthUpdatedFromFile: "File modified: {time}",
      dataHealthUpdatedFromReport: "Report updated: {time}",
      draggingBallLabel: "Dragging World Cup floating ball",
      exit: "Exit",
      exitFloatingBall: "Exit Floating Ball",
      expandBallLabel: "Expand World Cup brief",
      fixturesHeading: "Today's Fixtures",
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
      onboardingDismiss: "Got it",
      onboardingDragText: "Hold the ball for about 0.4 seconds, then drag it to a comfortable spot.",
      onboardingDragTitle: "Long-press to move it",
      onboardingFooterNote: "Later, use the panel to switch language, reload data, or quit the app.",
      onboardingKicker: "WORLD CUP GADGET",
      onboardingLocalText: "Reports are read from local latest.json. The frontend does not call remote match APIs.",
      onboardingLocalTitle: "Local data, no network API",
      onboardingMorningText: "Enable and adjust daily auto-show from Settings. It is off by default.",
      onboardingMorningTitle: "Morning 10:00 brief",
      onboardingOpenText: "Open the panel to see scores, flags, scorers, goal times, and all matches.",
      onboardingOpenTitle: "Click the ball to open the brief",
      onboardingStepsLabel: "How it works",
      onboardingSubtitle: "A few things to know the first time. After this, it will wait quietly at the screen edge.",
      onboardingTitle: "Your World Cup gadget is ready",
      onboardingViewLabel: "First-run onboarding",
      openclawReady: "OPENCLAW READY",
      panelSubtitle: "Latest Status · Beijing Time",
      panelTitle: "2026 World Cup Brief",
      readingReport: "Reading local report…",
      refresh: "Refresh",
      refreshSuccess: "Refreshed · latest.json has been reloaded",
      refreshTitle: "Reload latest.json",
      reportUnavailable: "Local report unavailable",
      settings: "Settings",
      settingsBack: "Back",
      settingsBackTitle: "Back to brief",
      settingsDataButton: "Reload",
      settingsDataDescription: "Reload latest.json without calling network APIs.",
      settingsDataHeading: "Local Data",
      settingsDailyDescription: "Open the brief automatically at a chosen time each day. Off by default.",
      settingsDailyHeading: "Daily Auto-Show",
      settingsDailyStatusDisabled: "Disabled",
      settingsDailyStatusEnabled: "Enabled · every day at {time}",
      settingsDailyStatusFailed: "Setup failed · local preferences could not be saved",
      settingsDailyTimeLabel: "Show time",
      settingsDailyToggleLabel: "Enable",
      settingsDailyUpdated: "Daily auto-show settings updated.",
      settingsDiagnosticsButton: "Copy Diagnostics",
      settingsDiagnosticsDescription: "Copy version, platform, data path, and current state.",
      settingsDiagnosticsHeading: "Diagnostics",
      settingsDiagnosticsStatusError: "Diagnostics copy failed.",
      settingsDiagnosticsStatusSuccess: "Diagnostics copied to clipboard.",
      settingsGuideButton: "Show Again",
      settingsGuideDescription: "Review the basic floating ball interactions.",
      settingsGuideHeading: "First-Run Guide",
      settingsKicker: "WORLD CUP GADGET",
      settingsLanguageDescription: "Switch the floating gadget interface language.",
      settingsLanguageHeading: "Language",
      settingsOpenTitle: "Open settings",
      settingsPositionButton: "Reset Position",
      settingsPositionDescription: "Move the current window back to the default right-side position.",
      settingsPositionHeading: "Window Position",
      settingsQuitButton: "Quit",
      settingsQuitDescription: "Close the floating ball and background process.",
      settingsQuitHeading: "Quit App",
      settingsStatusDataError: "Data reload failed. Please check latest.json.",
      settingsStatusDataSuccess: "Local data has been reloaded.",
      settingsStatusPosition: "Window position reset.",
      settingsSubtitle: "Manage the floating ball, auto-show, language, and local data.",
      settingsTitle: "Settings",
      settingsViewLabel: "Settings",
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
  const onboardingView = document.getElementById("onboarding-view");
  const panelView = document.getElementById("panel-view");
  const settingsView = document.getElementById("settings-view");
  const ballButton = document.getElementById("ball-button");
  const ballBadge = document.querySelector(".ball-badge");
  const collapseButton = document.getElementById("collapse-button");
  const refreshButton = document.getElementById("refresh-button");
  const settingsButton = document.getElementById("settings-button");
  const quitButton = document.getElementById("quit-button");
  const moreButton = document.getElementById("more-button");
  const moreButtonLabel = document.getElementById("more-button-label");
  const latestContainer = document.getElementById("latest-match");
  const allMatchesContainer = document.getElementById("all-matches");
  const allMatchesSection = document.getElementById("all-matches-section");
  const statusMessage = document.getElementById("status-message");
  const dataHealthCard = document.getElementById("data-health-card");
  const dataHealthTitle = document.getElementById("data-health-title");
  const dataHealthStatus = document.getElementById("data-health-status");
  const dataHealthDetail = document.getElementById("data-health-detail");
  const summaryCard = document.getElementById("summary-card");
  const updatedAt = document.getElementById("updated-at");
  const matchCount = document.getElementById("match-count");
  const panelLanguageSwitcher = document.getElementById("panel-language-switcher");
  const onboardingLanguageSwitcher = document.getElementById("onboarding-language-switcher");
  const settingsLanguageSwitcher = document.getElementById("settings-language-switcher");
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
  const onboardingKicker = document.getElementById("onboarding-kicker");
  const onboardingTitle = document.getElementById("onboarding-title");
  const onboardingSubtitle = document.getElementById("onboarding-subtitle");
  const onboardingSteps = document.getElementById("onboarding-steps");
  const onboardingOpenTitle = document.getElementById("onboarding-open-title");
  const onboardingOpenText = document.getElementById("onboarding-open-text");
  const onboardingDragTitle = document.getElementById("onboarding-drag-title");
  const onboardingDragText = document.getElementById("onboarding-drag-text");
  const onboardingMorningTitle = document.getElementById("onboarding-morning-title");
  const onboardingMorningText = document.getElementById("onboarding-morning-text");
  const onboardingLocalTitle = document.getElementById("onboarding-local-title");
  const onboardingLocalText = document.getElementById("onboarding-local-text");
  const onboardingFooterNote = document.getElementById("onboarding-footer-note");
  const onboardingDismissButton = document.getElementById("onboarding-dismiss-button");
  const settingsKicker = document.getElementById("settings-kicker");
  const settingsTitle = document.getElementById("settings-title");
  const settingsSubtitle = document.getElementById("settings-subtitle");
  const settingsBackButton = document.getElementById("settings-back-button");
  const settingsLanguageHeading = document.getElementById("settings-language-heading");
  const settingsLanguageDescription = document.getElementById("settings-language-description");
  const settingsDailyHeading = document.getElementById("settings-daily-heading");
  const settingsDailyDescription = document.getElementById("settings-daily-description");
  const settingsDailyToggle = document.getElementById("settings-daily-toggle");
  const settingsDailyToggleLabel = document.getElementById("settings-daily-toggle-label");
  const settingsDailyTimeInput = document.getElementById("settings-daily-time-input");
  const settingsDailyStatus = document.getElementById("settings-daily-status");
  const settingsGuideHeading = document.getElementById("settings-guide-heading");
  const settingsGuideDescription = document.getElementById("settings-guide-description");
  const settingsGuideButton = document.getElementById("settings-guide-button");
  const settingsPositionHeading = document.getElementById("settings-position-heading");
  const settingsPositionDescription = document.getElementById("settings-position-description");
  const settingsPositionButton = document.getElementById("settings-position-button");
  const settingsDataHeading = document.getElementById("settings-data-heading");
  const settingsDataDescription = document.getElementById("settings-data-description");
  const settingsDataHealthStatus = document.getElementById("settings-data-health-status");
  const settingsDataButton = document.getElementById("settings-data-button");
  const settingsDiagnosticsHeading = document.getElementById("settings-diagnostics-heading");
  const settingsDiagnosticsDescription = document.getElementById("settings-diagnostics-description");
  const settingsDiagnosticsButton = document.getElementById("settings-diagnostics-button");
  const settingsQuitHeading = document.getElementById("settings-quit-heading");
  const settingsQuitDescription = document.getElementById("settings-quit-description");
  const settingsQuitButton = document.getElementById("settings-quit-button");
  const settingsStatus = document.getElementById("settings-status");

  let currentLanguage = getCurrentLanguage();
  let currentReportData = null;
  let currentReportMeta = null;
  let currentDataHealth = null;
  let currentErrorCode = null;
  let showingAll = false;
  let statusTimer = null;
  let longPressTimer = null;
  let activePointerId = null;
  let pressStartPoint = null;
  let latestPointerPoint = null;
  let draggingBall = false;
  let suppressNextBallClick = false;
  let autoRefreshInProgress = false;
  let pendingAutoRefresh = false;
  let dailyAutoShowTimer = null;
  let dailyAutoShowSetupFailed = false;
  let dailyAutoShowSettings = readDailyAutoShowSettings();

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

  function hasCompletedOnboarding() {
    try {
      return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
    } catch (_error) {
      return false;
    }
  }

  function markOnboardingCompleted() {
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch (_error) {
      // The app remains usable if localStorage is blocked.
    }
  }

  function resetOnboardingCompletion() {
    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch (_error) {
      // The guide can still be shown in the current session.
    }
  }

  function readStorageValue(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      dailyAutoShowSetupFailed = true;
      return null;
    }
  }

  function writeStorageValue(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function isValidDailyShowTime(value) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ""));
  }

  function normalizedDailyShowTime(value) {
    return isValidDailyShowTime(value) ? String(value) : DEFAULT_DAILY_SHOW_TIME;
  }

  function readDailyAutoShowSettings() {
    const enabled = readStorageValue(DAILY_SHOW_ENABLED_STORAGE_KEY) === "true";
    const savedTime = readStorageValue(DAILY_SHOW_TIME_STORAGE_KEY);

    return {
      enabled,
      time: normalizedDailyShowTime(savedTime)
    };
  }

  function persistDailyAutoShowSettings(settings) {
    const savedEnabled = writeStorageValue(
      DAILY_SHOW_ENABLED_STORAGE_KEY,
      settings.enabled ? "true" : "false"
    );
    const savedTime = writeStorageValue(DAILY_SHOW_TIME_STORAGE_KEY, settings.time);
    dailyAutoShowSetupFailed = !(savedEnabled && savedTime);
    return !dailyAutoShowSetupFailed;
  }

  function dailyAutoShowStatusKind() {
    if (dailyAutoShowSetupFailed) return "failed";
    return dailyAutoShowSettings.enabled ? "enabled" : "disabled";
  }

  function dailyAutoShowStatusText() {
    if (dailyAutoShowSetupFailed) return t("settingsDailyStatusFailed");
    if (!dailyAutoShowSettings.enabled) return t("settingsDailyStatusDisabled");
    return t("settingsDailyStatusEnabled").replace("{time}", dailyAutoShowSettings.time);
  }

  function updateDailyAutoShowUI() {
    settingsDailyHeading.textContent = t("settingsDailyHeading");
    settingsDailyDescription.textContent = t("settingsDailyDescription");
    settingsDailyToggleLabel.textContent = t("settingsDailyToggleLabel");
    settingsDailyToggle.checked = dailyAutoShowSettings.enabled && !dailyAutoShowSetupFailed;
    settingsDailyTimeInput.value = dailyAutoShowSettings.time;
    settingsDailyTimeInput.disabled = !dailyAutoShowSettings.enabled || dailyAutoShowSetupFailed;
    settingsDailyTimeInput.setAttribute("aria-label", t("settingsDailyTimeLabel"));
    settingsDailyStatus.textContent = dailyAutoShowStatusText();
    settingsDailyStatus.className = `settings-inline-status settings-inline-status--${dailyAutoShowStatusKind()}`;
  }

  function parseDailyShowTime(value) {
    const [hours, minutes] = normalizedDailyShowTime(value).split(":").map(Number);
    return { hours, minutes };
  }

  function nextDailyAutoShowDate(now = new Date()) {
    const { hours, minutes } = parseDailyShowTime(dailyAutoShowSettings.time);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);

    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    return target;
  }

  function clearDailyAutoShowTimer() {
    if (!dailyAutoShowTimer) return;
    window.clearTimeout(dailyAutoShowTimer);
    dailyAutoShowTimer = null;
  }

  function scheduleDailyAutoShowRetry() {
    clearDailyAutoShowTimer();
    dailyAutoShowTimer = window.setTimeout(() => {
      runDailyAutoShow().catch(() => {
        dailyAutoShowSetupFailed = true;
        updateDailyAutoShowUI();
      });
    }, DAILY_AUTO_SHOW_RETRY_MS);
  }

  function scheduleDailyAutoShow() {
    clearDailyAutoShowTimer();
    updateDailyAutoShowUI();

    if (!dailyAutoShowSettings.enabled || dailyAutoShowSetupFailed) return;

    const nextRun = nextDailyAutoShowDate();
    const delay = Math.max(1000, nextRun.getTime() - Date.now());
    dailyAutoShowTimer = window.setTimeout(() => {
      runDailyAutoShow().catch(() => {
        dailyAutoShowSetupFailed = true;
        updateDailyAutoShowUI();
      });
    }, delay);
  }

  function shouldDeferDailyAutoShow() {
    return document.body.dataset.mode === "settings"
      || document.body.dataset.mode === "onboarding"
      || draggingBall;
  }

  function updateDailyAutoShowSettings(nextSettings) {
    dailyAutoShowSettings = {
      enabled: Boolean(nextSettings.enabled),
      time: normalizedDailyShowTime(nextSettings.time)
    };

    const saved = persistDailyAutoShowSettings(dailyAutoShowSettings);
    scheduleDailyAutoShow();
    showSettingsStatus(
      saved ? t("settingsDailyUpdated") : t("settingsDailyStatusFailed"),
      saved ? "success" : "error"
    );
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

  function formatMessage(key, values = {}) {
    return t(key).replace(/\{(\w+)\}/g, (_match, name) => {
      const value = values[name];
      return value === undefined || value === null ? "" : String(value);
    });
  }

  function parseReportDateTime(value) {
    if (!hasText(value)) return null;

    const text = String(value).trim();
    const beijingMatch = text.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
    if (beijingMatch) {
      const [, year, month, day, hour, minute] = beijingMatch.map(Number);
      const parsed = new Date(Date.UTC(year, month - 1, day, hour - 8, minute));
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function dateFromMeta(meta) {
    if (!meta || typeof meta !== "object") return null;

    if (Number.isFinite(Number(meta.mtimeMs))) {
      const parsed = new Date(Number(meta.mtimeMs));
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    if (hasText(meta.mtimeIso)) {
      const parsed = new Date(meta.mtimeIso);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
  }

  function formatDateTime(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return t("unknown");

    return new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  function reportPath(meta) {
    return meta && hasText(meta.path) ? meta.path : "../data/latest.json";
  }

  function validObjectItems(value) {
    return Array.isArray(value)
      ? value.filter((item) => item && typeof item === "object" && !Array.isArray(item))
      : [];
  }

  function healthStatusLabel(status) {
    if (status === "current") return t("dataHealthCurrent");
    if (status === "stale") return t("dataHealthStale");
    if (status === "missing") return t("dataHealthFileMissing");
    if (status === "invalid") return t("dataHealthInvalid");
    if (status === "pending") return t("dataHealthPending");
    return t("dataHealthUnknown");
  }

  function updateSourceText(data, meta) {
    const reportDateText = localizedTime(data, "updated_at", currentLanguage);
    if (reportDateText) {
      return formatMessage("dataHealthUpdatedFromReport", { time: reportDateText });
    }

    const fileDate = dateFromMeta(meta);
    if (fileDate) {
      return formatMessage("dataHealthUpdatedFromFile", { time: formatDateTime(fileDate) });
    }

    return t("dataHealthIssueUpdatedAtMissing");
  }

  function createPendingDataHealth() {
    return {
      status: "pending",
      title: t("dataHealthTitle"),
      label: t("dataHealthPending"),
      detail: t("dataHealthPendingDetail")
    };
  }

  function createErrorDataHealth(code, meta) {
    const status = code === "NOT_FOUND" ? "missing" : "invalid";
    const path = reportPath(meta);
    let detail = formatMessage("dataHealthInvalidDetail", { path });

    if (code === "NOT_FOUND") {
      detail = formatMessage("dataHealthMissingDetail", { path });
    } else if (code === "READ_FAILED") {
      detail = formatMessage("dataHealthReadFailedDetail", { path });
    }

    return {
      status,
      title: t("dataHealthTitle"),
      label: healthStatusLabel(status),
      detail
    };
  }

  function prepareReportData(data, meta) {
    const issues = [];
    const warnings = [];
    const hasValidRoot = data && typeof data === "object" && !Array.isArray(data);
    const source = hasValidRoot ? data : {};

    if (!hasValidRoot) {
      issues.push(t("dataHealthIssueReportRoot"));
    }

    const matches = validObjectItems(source.matches);
    if (!Array.isArray(source.matches)) {
      issues.push(t("dataHealthIssueMatchesMissing"));
    }

    if (matches.some((match) => !match.team_a || !match.team_b)) {
      warnings.push(t("dataHealthIssueTeamsMissing"));
    }

    const reportDate = parseReportDateTime(source.updated_at)
      || parseReportDateTime(source.updated_at_zh)
      || parseReportDateTime(source.updated_at_en);
    const fileDate = dateFromMeta(meta);
    const freshnessDate = reportDate || fileDate;

    if (!freshnessDate) {
      warnings.push(t("dataHealthIssueUpdatedAtMissing"));
    }

    let status = "current";
    if (issues.length) {
      status = "invalid";
    } else if (!freshnessDate) {
      status = "unknown";
    } else if (Date.now() - freshnessDate.getTime() > DATA_STALE_MS) {
      status = "stale";
    }

    const readTime = formatDateTime(new Date());
    const updatedTime = updateSourceText(source, meta);
    let detail = formatMessage("dataHealthCurrentDetail", {
      readTime,
      updatedTime,
      count: matches.length
    });

    if (status === "stale") {
      detail = formatMessage("dataHealthStaleDetail", {
        hours: DATA_STALE_HOURS,
        time: updateSourceText(source, meta)
      });
    } else if (status === "invalid") {
      detail = `${issues[0] || t("dataHealthInvalid")} · ${updateSourceText(source, meta)}`;
    } else if (status === "unknown") {
      detail = t("dataHealthUnknownDetail");
    } else if (warnings.length) {
      detail = `${detail} · ${warnings[0]}`;
    }

    return {
      data: {
        ...source,
        matches,
        today_fixtures: validObjectItems(source.today_fixtures),
        news: validObjectItems(source.news)
      },
      health: {
        status,
        title: t("dataHealthTitle"),
        label: healthStatusLabel(status),
        detail
      }
    };
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

  function renderDataHealth(health, options = {}) {
    const nextHealth = health || createPendingDataHealth();
    const showPanelCard = options.showPanelCard !== false && nextHealth.status !== "pending";
    currentDataHealth = nextHealth;

    dataHealthCard.hidden = !showPanelCard;
    dataHealthCard.className = `data-health-card data-health-card--${nextHealth.status}`;
    dataHealthTitle.textContent = nextHealth.title;
    dataHealthStatus.textContent = nextHealth.label;
    dataHealthDetail.textContent = nextHealth.detail;

    settingsDataHealthStatus.textContent = `${nextHealth.label} · ${nextHealth.detail}`;
    settingsDataHealthStatus.className = `settings-inline-status settings-inline-status--${nextHealth.status}`;
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
    onboardingView.setAttribute("aria-label", t("onboardingViewLabel"));
    panelView.setAttribute("aria-label", t("panelTitle"));
    settingsView.setAttribute("aria-label", t("settingsViewLabel"));

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
    onboardingKicker.textContent = t("onboardingKicker");
    onboardingTitle.textContent = t("onboardingTitle");
    onboardingSubtitle.textContent = t("onboardingSubtitle");
    onboardingSteps.setAttribute("aria-label", t("onboardingStepsLabel"));
    onboardingOpenTitle.textContent = t("onboardingOpenTitle");
    onboardingOpenText.textContent = t("onboardingOpenText");
    onboardingDragTitle.textContent = t("onboardingDragTitle");
    onboardingDragText.textContent = t("onboardingDragText");
    onboardingMorningTitle.textContent = t("onboardingMorningTitle");
    onboardingMorningText.textContent = t("onboardingMorningText");
    onboardingLocalTitle.textContent = t("onboardingLocalTitle");
    onboardingLocalText.textContent = t("onboardingLocalText");
    onboardingFooterNote.textContent = t("onboardingFooterNote");
    onboardingDismissButton.textContent = t("onboardingDismiss");
    settingsKicker.textContent = t("settingsKicker");
    settingsTitle.textContent = t("settingsTitle");
    settingsSubtitle.textContent = t("settingsSubtitle");
    settingsBackButton.textContent = t("settingsBack");
    settingsBackButton.title = t("settingsBackTitle");
    settingsLanguageHeading.textContent = t("settingsLanguageHeading");
    settingsLanguageDescription.textContent = t("settingsLanguageDescription");
    updateDailyAutoShowUI();
    settingsGuideHeading.textContent = t("settingsGuideHeading");
    settingsGuideDescription.textContent = t("settingsGuideDescription");
    settingsGuideButton.textContent = t("settingsGuideButton");
    settingsPositionHeading.textContent = t("settingsPositionHeading");
    settingsPositionDescription.textContent = t("settingsPositionDescription");
    settingsPositionButton.textContent = t("settingsPositionButton");
    settingsDataHeading.textContent = t("settingsDataHeading");
    settingsDataDescription.textContent = t("settingsDataDescription");
    dataHealthTitle.textContent = t("dataHealthTitle");
    settingsDataButton.textContent = settingsDataButton.disabled ? t("loading") : t("settingsDataButton");
    settingsDiagnosticsHeading.textContent = t("settingsDiagnosticsHeading");
    settingsDiagnosticsDescription.textContent = t("settingsDiagnosticsDescription");
    settingsDiagnosticsButton.textContent = settingsDiagnosticsButton.disabled ? t("loading") : t("settingsDiagnosticsButton");
    settingsQuitHeading.textContent = t("settingsQuitHeading");
    settingsQuitDescription.textContent = t("settingsQuitDescription");
    settingsQuitButton.textContent = t("settingsQuitButton");

    refreshButton.textContent = refreshButton.disabled ? t("loading") : t("refresh");
    refreshButton.title = t("refreshTitle");
    settingsButton.textContent = t("settings");
    settingsButton.title = t("settingsOpenTitle");
    collapseButton.textContent = t("collapse");
    collapseButton.title = t("collapseTitle");
    quitButton.textContent = t("exit");
    quitButton.title = t("exitFloatingBall");
    resetMoreButton();

    renderLanguageSwitcher(panelLanguageSwitcher);
    renderLanguageSwitcher(onboardingLanguageSwitcher);
    renderLanguageSwitcher(settingsLanguageSwitcher);

    if (!currentReportData && !currentErrorCode) {
      renderDataHealth(createPendingDataHealth(), { showPanelCard: false });
    }

    if (!rerenderDynamic) return;
    if (currentReportData) {
      renderReport(currentReportData, currentReportMeta);
    } else if (currentErrorCode) {
      updateErrorDisplay();
    } else {
      updatedAt.textContent = t("readingReport");
      renderDataHealth(createPendingDataHealth(), { showPanelCard: false });
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

  async function suppressBallContextMenu(event) {
    event.preventDefault();
    clearLongPressTimer();
    if (draggingBall) {
      await window.gadgetAPI.endWindowDrag().catch(() => {});
    }
    resetBallPointerState();
    suppressNextBallClick = false;
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
      : currentErrorCode === "NOT_FOUND"
        ? t("notFound")
        : t("reportUnavailable");
    statusMessage.className = "status-message status-message--error";
    statusMessage.hidden = false;
    renderDataHealth(createErrorDataHealth(currentErrorCode, currentReportMeta));
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

  function setError(code, meta) {
    currentReportData = null;
    currentReportMeta = meta || null;
    currentErrorCode = code;
    updateErrorDisplay();
  }

  function showPanelStatus(message, kind = "success", delay = 1600) {
    if (statusTimer) window.clearTimeout(statusTimer);
    statusMessage.textContent = message;
    statusMessage.className = `status-message status-message--${kind}`;
    statusMessage.hidden = false;
    statusTimer = window.setTimeout(() => {
      statusMessage.hidden = true;
      statusTimer = null;
    }, delay);
  }

  function showRefreshSuccess() {
    showPanelStatus(t("refreshSuccess"));
  }

  function renderReport(data, meta) {
    currentReportData = data;
    currentReportMeta = meta || null;
    currentErrorCode = null;

    const prepared = prepareReportData(data, currentReportMeta);
    const reportData = prepared.data;
    renderDataHealth(prepared.health);

    const matches = asArray(reportData.matches);
    const latest = latestFinishedMatch(matches);
    const summary = localizedValue(reportData, "summary", currentLanguage, "");

    statusMessage.hidden = true;
    updatedAt.textContent = `${t("updated")} · ${localizedTime(reportData, "updated_at", currentLanguage) || updateSourceText(reportData, currentReportMeta)}`;
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

    const standingsCount = renderStandings(reportData);
    const fixturesCount = renderFixtures(reportData);
    const newsCount = renderNews(reportData);
    reportExtras.hidden = standingsCount + fixturesCount + newsCount === 0;
  }

  async function readReport(method) {
    refreshButton.disabled = true;
    refreshButton.textContent = t("loading");
    try {
      const result = await window.gadgetAPI[method]();
      if (!result || !result.ok) {
        setError(result && result.error, result && result.meta);
        return;
      }
      renderReport(result.data, result.meta);
      if (method === "refreshReport") showRefreshSuccess();
    } catch (_error) {
      setError("READ_FAILED");
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = t("refresh");
    }
  }

  function showAutoRefreshResult(success) {
    const message = success ? t("autoRefreshSuccess") : t("autoRefreshError");
    const kind = success ? "success" : "error";

    if (document.body.dataset.mode === "panel") {
      showPanelStatus(message, kind, 2200);
    }

    if (document.body.dataset.mode === "settings") {
      showSettingsStatus(message, kind);
    }
  }

  async function refreshReportFromFileChange() {
    if (autoRefreshInProgress) {
      pendingAutoRefresh = true;
      return;
    }

    autoRefreshInProgress = true;

    try {
      const result = await window.gadgetAPI.refreshReport();
      if (!result || !result.ok) {
        setError(result && result.error, result && result.meta);
        showAutoRefreshResult(false);
        return;
      }

      renderReport(result.data, result.meta);
      showAutoRefreshResult(true);
    } catch (_error) {
      setError("READ_FAILED");
      showAutoRefreshResult(false);
    } finally {
      autoRefreshInProgress = false;
      if (pendingAutoRefresh) {
        pendingAutoRefresh = false;
        refreshReportFromFileChange().catch(() => {});
      }
    }
  }

  function showSettingsStatus(message, kind = "success") {
    settingsStatus.textContent = message;
    settingsStatus.className = `settings-status settings-status--${kind}`;
    settingsStatus.hidden = false;
  }

  async function runDailyAutoShow() {
    dailyAutoShowTimer = null;

    if (!dailyAutoShowSettings.enabled || dailyAutoShowSetupFailed) {
      scheduleDailyAutoShow();
      return;
    }

    if (shouldDeferDailyAutoShow()) {
      scheduleDailyAutoShowRetry();
      return;
    }

    try {
      await expandPanel();
    } catch (_error) {
      dailyAutoShowSetupFailed = true;
      updateDailyAutoShowUI();
      return;
    }

    scheduleDailyAutoShow();
  }

  async function expandPanel() {
    await window.gadgetAPI.expandWindow();
    document.body.dataset.mode = "panel";
    ballView.hidden = true;
    onboardingView.hidden = true;
    settingsView.hidden = true;
    panelView.hidden = false;
    await readReport("readLatestReport");
  }

  async function showOnboardingIfNeeded() {
    if (hasCompletedOnboarding()) return;

    await window.gadgetAPI.expandWindow();
    document.body.dataset.mode = "onboarding";
    ballView.hidden = true;
    panelView.hidden = true;
    settingsView.hidden = true;
    onboardingView.hidden = false;
    applyLanguage({ rerenderDynamic: false });
  }

  async function showOnboardingFromSettings() {
    resetOnboardingCompletion();
    settingsStatus.hidden = true;
    await window.gadgetAPI.expandWindow();
    document.body.dataset.mode = "onboarding";
    ballView.hidden = true;
    panelView.hidden = true;
    settingsView.hidden = true;
    onboardingView.hidden = false;
    applyLanguage({ rerenderDynamic: false });
  }

  async function dismissOnboarding() {
    markOnboardingCompleted();
    onboardingView.hidden = true;
    panelView.hidden = true;
    settingsView.hidden = true;
    ballView.hidden = false;
    document.body.dataset.mode = "ball";
    resetBallPointerState();
    await window.gadgetAPI.collapseWindow();
  }

  async function openSettings() {
    await window.gadgetAPI.expandWindow();
    settingsStatus.hidden = true;
    showingAll = false;
    resetMoreButton();
    allMatchesSection.hidden = true;
    document.body.dataset.mode = "settings";
    ballView.hidden = true;
    onboardingView.hidden = true;
    panelView.hidden = true;
    settingsView.hidden = false;
    applyLanguage({ rerenderDynamic: false });
  }

  function closeSettings() {
    settingsStatus.hidden = true;
    settingsView.hidden = true;
    onboardingView.hidden = true;
    ballView.hidden = true;
    panelView.hidden = false;
    document.body.dataset.mode = "panel";
  }

  async function resetPositionFromSettings() {
    try {
      await window.gadgetAPI.resetWindowPosition();
      showSettingsStatus(t("settingsStatusPosition"));
    } catch (_error) {
      showSettingsStatus(t("settingsStatusDataError"), "error");
    }
  }

  async function reloadDataFromSettings() {
    settingsDataButton.disabled = true;
    settingsDataButton.textContent = t("loading");
    try {
      const result = await window.gadgetAPI.refreshReport();
      if (!result || !result.ok) {
        setError(result && result.error, result && result.meta);
        showSettingsStatus(t("settingsStatusDataError"), "error");
        return;
      }
      renderReport(result.data, result.meta);
      showSettingsStatus(t("settingsStatusDataSuccess"));
    } catch (_error) {
      setError("READ_FAILED");
      showSettingsStatus(t("settingsStatusDataError"), "error");
    } finally {
      settingsDataButton.disabled = false;
      settingsDataButton.textContent = t("settingsDataButton");
    }
  }

  function diagnosticsValue(value) {
    if (value === null || value === undefined || value === "") return "unknown";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  function buildDiagnosticsText(baseDiagnostics) {
    const dataMeta = baseDiagnostics?.data?.meta || currentReportMeta || {};
    const dataHealth = currentDataHealth || createPendingDataHealth();
    const dailyStatus = dailyAutoShowSetupFailed
      ? "setup_failed"
      : dailyAutoShowSettings.enabled
        ? "enabled"
        : "disabled";

    return [
      "WorldCup Gadget Diagnostics",
      `generatedAt=${new Date().toISOString()}`,
      `app.name=${diagnosticsValue(baseDiagnostics?.app?.name)}`,
      `app.version=${diagnosticsValue(baseDiagnostics?.app?.version)}`,
      `app.packaged=${diagnosticsValue(baseDiagnostics?.app?.packaged)}`,
      `app.locale=${diagnosticsValue(baseDiagnostics?.app?.locale)}`,
      `runtime.platform=${diagnosticsValue(baseDiagnostics?.runtime?.platform)}`,
      `runtime.arch=${diagnosticsValue(baseDiagnostics?.runtime?.arch)}`,
      `runtime.electron=${diagnosticsValue(baseDiagnostics?.runtime?.electron)}`,
      `runtime.chrome=${diagnosticsValue(baseDiagnostics?.runtime?.chrome)}`,
      `runtime.node=${diagnosticsValue(baseDiagnostics?.runtime?.node)}`,
      `ui.language=${currentLanguage}`,
      `ui.mode=${diagnosticsValue(document.body.dataset.mode)}`,
      `dailyAutoShow.status=${dailyStatus}`,
      `dailyAutoShow.time=${diagnosticsValue(dailyAutoShowSettings.time)}`,
      `data.exists=${diagnosticsValue(baseDiagnostics?.data?.exists)}`,
      `data.path=${diagnosticsValue(dataMeta.path)}`,
      `data.mtimeIso=${diagnosticsValue(dataMeta.mtimeIso)}`,
      `data.size=${diagnosticsValue(dataMeta.size)}`,
      `data.health.status=${diagnosticsValue(dataHealth.status)}`,
      `data.health.label=${diagnosticsValue(dataHealth.label)}`,
      `data.health.detail=${diagnosticsValue(dataHealth.detail)}`,
      `window.visible=${diagnosticsValue(baseDiagnostics?.window?.visible)}`,
      `window.expanded=${diagnosticsValue(baseDiagnostics?.window?.expanded)}`,
      `window.bounds=${diagnosticsValue(baseDiagnostics?.window?.bounds)}`
    ].join("\n");
  }

  async function copyDiagnosticsFromSettings() {
    settingsDiagnosticsButton.disabled = true;
    settingsDiagnosticsButton.textContent = t("loading");

    try {
      const diagnostics = await window.gadgetAPI.readDiagnostics();
      if (!diagnostics || !diagnostics.ok) {
        throw new Error("Diagnostics unavailable");
      }

      const copied = await window.gadgetAPI.writeClipboardText(buildDiagnosticsText(diagnostics));
      if (!copied || !copied.ok) {
        throw new Error("Clipboard write failed");
      }

      showSettingsStatus(t("settingsDiagnosticsStatusSuccess"));
    } catch (_error) {
      showSettingsStatus(t("settingsDiagnosticsStatusError"), "error");
    } finally {
      settingsDiagnosticsButton.disabled = false;
      settingsDiagnosticsButton.textContent = t("settingsDiagnosticsButton");
    }
  }

  async function collapsePanel() {
    showingAll = false;
    resetMoreButton();
    allMatchesSection.hidden = true;
    onboardingView.hidden = true;
    settingsView.hidden = true;
    panelView.hidden = true;
    ballView.hidden = false;
    document.body.dataset.mode = "ball";
    await window.gadgetAPI.collapseWindow();
  }

  function showBallOnly() {
    showingAll = false;
    resetMoreButton();
    allMatchesSection.hidden = true;
    onboardingView.hidden = true;
    settingsView.hidden = true;
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
  ballView.addEventListener("contextmenu", suppressBallContextMenu);
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
  settingsButton.addEventListener("click", () => {
    openSettings().catch(() => {});
  });
  quitButton.addEventListener("click", quitApp);
  moreButton.addEventListener("click", toggleAllMatches);
  settingsBackButton.addEventListener("click", closeSettings);
  settingsDailyToggle.addEventListener("change", () => {
    updateDailyAutoShowSettings({
      enabled: settingsDailyToggle.checked,
      time: dailyAutoShowSettings.time
    });
  });
  settingsDailyTimeInput.addEventListener("change", () => {
    updateDailyAutoShowSettings({
      enabled: dailyAutoShowSettings.enabled,
      time: settingsDailyTimeInput.value
    });
  });
  settingsGuideButton.addEventListener("click", () => {
    showOnboardingFromSettings().catch(() => {});
  });
  settingsPositionButton.addEventListener("click", () => {
    resetPositionFromSettings().catch(() => {});
  });
  settingsDataButton.addEventListener("click", () => {
    reloadDataFromSettings().catch(() => {});
  });
  settingsDiagnosticsButton.addEventListener("click", () => {
    copyDiagnosticsFromSettings().catch(() => {});
  });
  settingsQuitButton.addEventListener("click", quitApp);
  onboardingDismissButton.addEventListener("click", () => {
    dismissOnboarding().catch(() => {});
  });
  window.gadgetAPI.onReportChanged(() => {
    refreshReportFromFileChange().catch(() => {});
  });
  window.gadgetAPI.onShortcutShowBall(showBallOnly);

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (document.body.dataset.mode === "onboarding") {
      dismissOnboarding().catch(() => {});
      return;
    }
    if (document.body.dataset.mode === "settings") {
      closeSettings();
      return;
    }
    if (document.body.dataset.mode === "panel") collapsePanel();
  });

  applyLanguage({ rerenderDynamic: false });
  scheduleDailyAutoShow();
  showOnboardingIfNeeded().catch(() => {});
})();
