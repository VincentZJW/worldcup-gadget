"use strict";

const { app, BrowserWindow, clipboard, globalShortcut, ipcMain, screen } = require("electron");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const os = require("node:os");
const path = require("node:path");

const BALL_SIZE = 64;
const PANEL_WIDTH = 420;
const PANEL_HEIGHT = 620;
const SCREEN_MARGIN = 20;
const GLOBAL_SHOW_BALL_SHORTCUT = "Control+Alt+W";
const PID_FILE = path.join(os.tmpdir(), "worldcup-floating-gadget.pid");
const REPORT_WATCH_DEBOUNCE_MS = 500;
const REPORT_WATCH_POLL_MS = 5000;
const LEGACY_WORLD_CUP_FEED_URLS = new Set([
  "https://cdn.jsdelivr.net/gh/VincentZJW/worldcup-gadget@master/data/latest.json",
  "https://raw.githubusercontent.com/VincentZJW/worldcup-gadget/master/data/latest.json"
]);
const DEFAULT_WORLD_CUP_FEED_URL =
  "https://cdn.jsdelivr.net/gh/VincentZJW/worldcup-gadget/data/latest.json";
const DATA_UPDATE_INTERVAL_MS = 30 * 60 * 1000;
const DATA_UPDATE_TIMEOUT_MS = 15 * 1000;
const DATA_UPDATE_MAX_BYTES = 1024 * 1024;
const SETTINGS_FILE_NAME = "settings.json";

let gadgetWindow = null;
let windowShown = false;
let dragState = null;
let isPanelExpanded = false;
let ownsPidFile = false;
let reportDirectoryWatcher = null;
let reportWatchDebounceTimer = null;
let lastReportSignature = "";
let dataUpdateTimer = null;
let dataUpdateInFlight = null;
let dataUpdateStatus = {
  enabled: true,
  feedUrl: DEFAULT_WORLD_CUP_FEED_URL,
  updating: false,
  lastAttemptIso: null,
  lastSuccessIso: null,
  lastError: null,
  nextRunIso: null
};

function bundledReportPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "data", "latest.json");
  }

  return path.resolve(__dirname, "..", "data", "latest.json");
}

function userDataDirectory() {
  return app.getPath("userData");
}

function settingsPath() {
  return path.join(userDataDirectory(), SETTINGS_FILE_NAME);
}

function latestReportPath() {
  return path.join(userDataDirectory(), "data", "latest.json");
}

function latestReportDirectory() {
  return path.dirname(latestReportPath());
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function defaultBallBounds() {
  const { workArea } = screen.getPrimaryDisplay();
  return {
    width: BALL_SIZE,
    height: BALL_SIZE,
    x: workArea.x + workArea.width - BALL_SIZE - SCREEN_MARGIN,
    y: workArea.y + Math.round(workArea.height * 0.18)
  };
}

function resizedBounds(width, height) {
  if (!gadgetWindow) return { ...defaultBallBounds(), width, height };

  const current = gadgetWindow.getBounds();
  const { workArea } = screen.getDisplayMatching(current);
  const currentRight = current.x + current.width;
  const x = clamp(
    currentRight - width,
    workArea.x + 8,
    workArea.x + workArea.width - width - 8
  );
  const y = clamp(
    current.y,
    workArea.y + 8,
    workArea.y + workArea.height - height - 8
  );

  return { x, y, width, height };
}

function applyWindowSize(width, height) {
  if (!gadgetWindow) return false;
  gadgetWindow.setBounds(resizedBounds(width, height), true);
  gadgetWindow.setAlwaysOnTop(true, "floating");
  return true;
}

function resetWindowPosition() {
  if (!gadgetWindow) return false;
  const current = gadgetWindow.getBounds();
  const { workArea } = screen.getPrimaryDisplay();
  const nextBounds = {
    width: current.width,
    height: current.height,
    x: clamp(
      workArea.x + workArea.width - current.width - SCREEN_MARGIN,
      workArea.x + 8,
      workArea.x + workArea.width - current.width - 8
    ),
    y: clamp(
      workArea.y + Math.round(workArea.height * 0.18),
      workArea.y + 8,
      workArea.y + workArea.height - current.height - 8
    )
  };
  gadgetWindow.setBounds(nextBounds, true);
  gadgetWindow.setAlwaysOnTop(true, "floating");
  return true;
}

function expandWindow() {
  isPanelExpanded = true;
  return applyWindowSize(PANEL_WIDTH, PANEL_HEIGHT);
}

function collapseWindow() {
  isPanelExpanded = false;
  return applyWindowSize(BALL_SIZE, BALL_SIZE);
}

function writePidFile() {
  try {
    fsSync.writeFileSync(PID_FILE, `${process.pid}\n`, "utf8");
    ownsPidFile = true;
  } catch (error) {
    console.warn(`Unable to write PID file at ${PID_FILE}:`, error);
  }
}

function cleanupPidFile() {
  try {
    if (!ownsPidFile) return;
    if (!fsSync.existsSync(PID_FILE)) return;
    fsSync.unlinkSync(PID_FILE);
  } catch (error) {
    console.warn(`Unable to remove PID file at ${PID_FILE}:`, error);
  }
}

function pointFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  const x = Number(payload.screenX);
  const y = Number(payload.screenY);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x: Math.round(x), y: Math.round(y) };
}

function clampedWindowPosition(bounds, pointer) {
  const display = screen.getDisplayNearestPoint(pointer);
  const { workArea } = display;
  return {
    x: clamp(bounds.x, workArea.x + 4, workArea.x + workArea.width - bounds.width - 4),
    y: clamp(bounds.y, workArea.y + 4, workArea.y + workArea.height - bounds.height - 4)
  };
}

function beginCustomDrag(payload) {
  if (!gadgetWindow) return false;
  const pointer = pointFromPayload(payload);
  if (!pointer) return false;
  dragState = {
    pointer,
    bounds: gadgetWindow.getBounds()
  };
  gadgetWindow.setAlwaysOnTop(true, "floating");
  return true;
}

function moveCustomDrag(payload) {
  if (!gadgetWindow || !dragState) return false;
  const pointer = pointFromPayload(payload);
  if (!pointer) return false;
  const nextBounds = {
    ...dragState.bounds,
    x: dragState.bounds.x + pointer.x - dragState.pointer.x,
    y: dragState.bounds.y + pointer.y - dragState.pointer.y
  };
  const nextPosition = clampedWindowPosition(nextBounds, pointer);
  gadgetWindow.setPosition(nextPosition.x, nextPosition.y, false);
  return true;
}

function endCustomDrag() {
  dragState = null;
  return true;
}

function showGadgetWindow() {
  if (!gadgetWindow || windowShown) return;
  windowShown = true;
  gadgetWindow.showInactive();
  gadgetWindow.setAlwaysOnTop(true, "floating");
}

function showAndFocusWindow() {
  if (!gadgetWindow) {
    createWindow();
    return false;
  }

  if (gadgetWindow.isMinimized()) {
    gadgetWindow.restore();
  }

  gadgetWindow.show();
  gadgetWindow.setAlwaysOnTop(true, "floating");
  gadgetWindow.focus();
  return true;
}

function showFloatingBall() {
  if (!gadgetWindow) {
    createWindow();
    return false;
  }

  if (gadgetWindow.isMinimized()) {
    gadgetWindow.restore();
  }

  collapseWindow();
  gadgetWindow.webContents.send("shortcut:show-ball");
  gadgetWindow.show();
  gadgetWindow.setAlwaysOnTop(true, "floating");
  if (typeof gadgetWindow.moveTop === "function") {
    gadgetWindow.moveTop();
  }
  gadgetWindow.focus();
  return true;
}

function handleSecondInstance() {
  showFloatingBall();
}

function handleGlobalShowBallShortcut() {
  showFloatingBall();
}

function registerGlobalShortcut() {
  const registered = globalShortcut.register(GLOBAL_SHOW_BALL_SHORTCUT, handleGlobalShowBallShortcut);
  if (!registered) {
    console.warn(
      `WorldCup Floating Gadget warning: failed to register global shortcut ${GLOBAL_SHOW_BALL_SHORTCUT}.`
    );
  }
}

function defaultPersistentSettings() {
  return {
    dataAutoUpdateEnabled: true,
    dataFeedUrl: DEFAULT_WORLD_CUP_FEED_URL
  };
}

function readPersistentSettings() {
  try {
    const raw = fsSync.readFileSync(settingsPath(), "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...defaultPersistentSettings(),
      ...(parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {})
    };
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      console.warn(`Unable to read settings at ${settingsPath()}:`, error);
    }
    return defaultPersistentSettings();
  }
}

function writePersistentSettings(nextSettings) {
  const merged = {
    ...defaultPersistentSettings(),
    ...nextSettings
  };

  fsSync.mkdirSync(path.dirname(settingsPath()), { recursive: true });
  fsSync.writeFileSync(settingsPath(), `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  return merged;
}

function loadDataUpdateSettings() {
  const settings = readPersistentSettings();
  dataUpdateStatus.enabled = settings.dataAutoUpdateEnabled !== false;
  const savedFeedUrl = typeof settings.dataFeedUrl === "string" ? settings.dataFeedUrl.trim() : "";
  dataUpdateStatus.feedUrl = savedFeedUrl && !LEGACY_WORLD_CUP_FEED_URLS.has(savedFeedUrl)
    ? savedFeedUrl
    : DEFAULT_WORLD_CUP_FEED_URL;
  return settings;
}

function reportDataLooksValid(data) {
  return Boolean(
    data
      && typeof data === "object"
      && !Array.isArray(data)
      && Array.isArray(data.matches)
  );
}

async function ensureWritableReportSeed() {
  const targetPath = latestReportPath();
  try {
    await fs.access(targetPath);
    return { ok: true, path: targetPath, seeded: false };
  } catch (_error) {
    // Continue with seed copy.
  }

  await fs.mkdir(latestReportDirectory(), { recursive: true });
  try {
    await fs.copyFile(bundledReportPath(), targetPath);
    return { ok: true, path: targetPath, seeded: true };
  } catch (error) {
    console.warn(`Unable to seed report cache from ${bundledReportPath()}:`, error);
    return { ok: false, path: targetPath, error: "SEED_FAILED" };
  }
}

function requestText(urlString, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    let url;
    try {
      url = new URL(urlString);
    } catch (_error) {
      reject(new Error("INVALID_FEED_URL"));
      return;
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      reject(new Error("UNSUPPORTED_FEED_PROTOCOL"));
      return;
    }

    const transport = url.protocol === "https:" ? https : http;
    const request = transport.get(
      url,
      {
        headers: {
          "accept": "application/json,text/plain;q=0.9,*/*;q=0.8",
          "user-agent": `WorldCupGadget/${app.getVersion()}`
        },
        timeout: DATA_UPDATE_TIMEOUT_MS
      },
      (response) => {
        const statusCode = response.statusCode || 0;
        const location = response.headers.location;

        if (statusCode >= 300 && statusCode < 400 && location) {
          response.resume();
          if (redirectCount >= 3) {
            reject(new Error("TOO_MANY_REDIRECTS"));
            return;
          }
          const nextUrl = new URL(location, url).toString();
          requestText(nextUrl, redirectCount + 1).then(resolve, reject);
          return;
        }

        if (statusCode < 200 || statusCode >= 300) {
          response.resume();
          reject(new Error(`HTTP_${statusCode || "UNKNOWN"}`));
          return;
        }

        const chunks = [];
        let totalBytes = 0;
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          totalBytes += Buffer.byteLength(chunk, "utf8");
          if (totalBytes > DATA_UPDATE_MAX_BYTES) {
            request.destroy(new Error("FEED_TOO_LARGE"));
            return;
          }
          chunks.push(chunk);
        });
        response.on("end", () => resolve(chunks.join("")));
      }
    );

    request.on("timeout", () => request.destroy(new Error("FEED_TIMEOUT")));
    request.on("error", reject);
  });
}

async function fetchRemoteReport(feedUrl) {
  const raw = await requestText(feedUrl);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_error) {
    throw new Error("INVALID_REMOTE_JSON");
  }

  if (!reportDataLooksValid(parsed)) {
    throw new Error("INVALID_REMOTE_SCHEMA");
  }

  return parsed;
}

async function writeReportCache(data) {
  const targetPath = latestReportPath();
  const tempPath = `${targetPath}.tmp`;
  await fs.mkdir(latestReportDirectory(), { recursive: true });
  await fs.writeFile(tempPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(tempPath, targetPath);
  return targetPath;
}

function notifyDataUpdateStatus() {
  if (!gadgetWindow || gadgetWindow.isDestroyed()) return;
  gadgetWindow.webContents.send("data-update:status", getDataUpdateStatus());
}

function getDataUpdateStatus() {
  return {
    ok: true,
    ...dataUpdateStatus
  };
}

function scheduleNextDataUpdate(delayMs = DATA_UPDATE_INTERVAL_MS) {
  if (dataUpdateTimer) {
    clearTimeout(dataUpdateTimer);
    dataUpdateTimer = null;
  }

  if (!dataUpdateStatus.enabled) {
    dataUpdateStatus.nextRunIso = null;
    notifyDataUpdateStatus();
    return;
  }

  const delay = Math.max(1000, delayMs);
  dataUpdateStatus.nextRunIso = new Date(Date.now() + delay).toISOString();
  dataUpdateTimer = setTimeout(() => {
    runDataUpdate("schedule").catch(() => {});
  }, delay);
  notifyDataUpdateStatus();
}

async function runDataUpdate(reason = "manual") {
  loadDataUpdateSettings();

  if (!dataUpdateStatus.enabled && reason !== "manual") {
    return getDataUpdateStatus();
  }

  if (dataUpdateInFlight) {
    return dataUpdateInFlight;
  }

  dataUpdateStatus.updating = true;
  dataUpdateStatus.lastAttemptIso = new Date().toISOString();
  dataUpdateStatus.lastError = null;
  notifyDataUpdateStatus();

  dataUpdateInFlight = (async () => {
    try {
      const data = await fetchRemoteReport(dataUpdateStatus.feedUrl);
      await writeReportCache(data);
      dataUpdateStatus.lastSuccessIso = new Date().toISOString();
      dataUpdateStatus.lastError = null;
      return getDataUpdateStatus();
    } catch (error) {
      dataUpdateStatus.lastError = error && error.message ? error.message : "UPDATE_FAILED";
      console.warn(`WorldCup data update failed (${reason}):`, error);
      return getDataUpdateStatus();
    } finally {
      dataUpdateStatus.updating = false;
      dataUpdateInFlight = null;
      scheduleNextDataUpdate();
      notifyDataUpdateStatus();
    }
  })();

  return dataUpdateInFlight;
}

function setDataAutoUpdateEnabled(enabled) {
  const current = readPersistentSettings();
  const nextSettings = writePersistentSettings({
    ...current,
    dataAutoUpdateEnabled: Boolean(enabled)
  });
  dataUpdateStatus.enabled = nextSettings.dataAutoUpdateEnabled !== false;
  dataUpdateStatus.feedUrl = nextSettings.dataFeedUrl || DEFAULT_WORLD_CUP_FEED_URL;
  if (dataUpdateStatus.enabled) {
    scheduleNextDataUpdate(1000);
  } else {
    scheduleNextDataUpdate();
  }
  return getDataUpdateStatus();
}

async function startDataUpdater() {
  loadDataUpdateSettings();
  if (!dataUpdateStatus.enabled) {
    scheduleNextDataUpdate();
    return;
  }
  scheduleNextDataUpdate(1000);
}

function stopDataUpdater() {
  if (!dataUpdateTimer) return;
  clearTimeout(dataUpdateTimer);
  dataUpdateTimer = null;
  dataUpdateStatus.nextRunIso = null;
}

function reportMetaFromStats(reportPath, stats) {
  return {
    path: reportPath,
    mtimeIso: stats.mtime.toISOString(),
    mtimeMs: stats.mtimeMs,
    size: stats.size
  };
}

function reportSnapshot() {
  const reportPath = latestReportPath();
  try {
    const stats = fsSync.statSync(reportPath);
    return {
      exists: true,
      signature: `${stats.mtimeMs}:${stats.size}`,
      meta: reportMetaFromStats(reportPath, stats)
    };
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      console.warn(`Unable to stat report file at ${reportPath}:`, error);
    }
    return {
      exists: false,
      signature: "missing",
      meta: { path: reportPath }
    };
  }
}

function notifyReportChanged(source, snapshot) {
  if (!gadgetWindow || gadgetWindow.isDestroyed()) return;
  gadgetWindow.webContents.send("report:changed", {
    source,
    ok: snapshot.exists,
    error: snapshot.exists ? null : "NOT_FOUND",
    meta: snapshot.meta,
    changedAt: new Date().toISOString()
  });
}

function checkForReportChange(source) {
  reportWatchDebounceTimer = null;
  const snapshot = reportSnapshot();
  if (snapshot.signature === lastReportSignature) return;
  lastReportSignature = snapshot.signature;
  notifyReportChanged(source, snapshot);
}

function scheduleReportChangeCheck(source) {
  if (reportWatchDebounceTimer) {
    clearTimeout(reportWatchDebounceTimer);
  }
  reportWatchDebounceTimer = setTimeout(
    () => checkForReportChange(source),
    REPORT_WATCH_DEBOUNCE_MS
  );
}

function startReportWatcher() {
  const reportPath = latestReportPath();
  const reportDirectory = path.dirname(reportPath);
  const reportFileName = path.basename(reportPath);

  stopReportWatcher();
  lastReportSignature = reportSnapshot().signature;

  try {
    if (fsSync.existsSync(reportDirectory)) {
      reportDirectoryWatcher = fsSync.watch(
        reportDirectory,
        { persistent: false },
        (eventType, filename) => {
          const changedName = filename ? filename.toString() : "";
          if (changedName && changedName !== reportFileName) return;
          scheduleReportChangeCheck(`fs.watch:${eventType || "change"}`);
        }
      );
      reportDirectoryWatcher.on("error", (error) => {
        console.warn(`Unable to watch report directory at ${reportDirectory}:`, error);
      });
    }
  } catch (error) {
    console.warn(`Unable to watch report directory at ${reportDirectory}:`, error);
  }

  fsSync.watchFile(
    reportPath,
    { interval: REPORT_WATCH_POLL_MS, persistent: false },
    (current, previous) => {
      if (current.mtimeMs === previous.mtimeMs && current.size === previous.size) return;
      scheduleReportChangeCheck("fs.watchFile");
    }
  );
}

function stopReportWatcher() {
  if (reportWatchDebounceTimer) {
    clearTimeout(reportWatchDebounceTimer);
    reportWatchDebounceTimer = null;
  }

  if (reportDirectoryWatcher) {
    reportDirectoryWatcher.close();
    reportDirectoryWatcher = null;
  }

  fsSync.unwatchFile(latestReportPath());
}

async function readLatestReport() {
  await ensureWritableReportSeed();
  const reportPath = latestReportPath();
  let raw;
  let stats = null;
  try {
    raw = await fs.readFile(reportPath, "utf8");
    stats = await fs.stat(reportPath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return { ok: false, error: "NOT_FOUND", meta: { path: reportPath } };
    }
    return { ok: false, error: "READ_FAILED", meta: { path: reportPath } };
  }

  const meta = reportMetaFromStats(reportPath, stats);

  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false, error: "INVALID_JSON", meta };
    }
    return { ok: true, data, meta };
  } catch (_error) {
    return { ok: false, error: "INVALID_JSON", meta };
  }
}

function assertTrustedSender(event) {
  if (!gadgetWindow || event.sender !== gadgetWindow.webContents) {
    throw new Error("Untrusted IPC sender");
  }
}

function quitGadget() {
  app.quit();
  return { ok: true };
}

function readLoginItemSettings() {
  const supported = process.platform === "darwin" || process.platform === "win32";
  if (!supported) {
    return {
      ok: true,
      supported: false,
      openAtLogin: false,
      error: "UNSUPPORTED_PLATFORM"
    };
  }

  try {
    const settings = app.getLoginItemSettings();
    return {
      ok: true,
      supported: true,
      openAtLogin: Boolean(settings.openAtLogin),
      wasOpenedAtLogin: Boolean(settings.wasOpenedAtLogin),
      wasOpenedAsHidden: Boolean(settings.wasOpenedAsHidden)
    };
  } catch (error) {
    console.warn("Unable to read login item settings:", error);
    return {
      ok: false,
      supported: true,
      openAtLogin: false,
      error: "READ_FAILED"
    };
  }
}

function setLoginItemEnabled(enabled) {
  const supported = process.platform === "darwin" || process.platform === "win32";
  if (!supported) {
    return {
      ok: false,
      supported: false,
      openAtLogin: false,
      error: "UNSUPPORTED_PLATFORM"
    };
  }

  try {
    const settings = {
      openAtLogin: Boolean(enabled)
    };

    if (process.platform === "darwin") {
      settings.openAsHidden = true;
    }

    app.setLoginItemSettings(settings);
  } catch (error) {
    console.warn("Unable to update login item settings:", error);
    return {
      ok: false,
      supported: true,
      openAtLogin: false,
      error: "SET_FAILED"
    };
  }

  return readLoginItemSettings();
}

function readAppDiagnostics() {
  const snapshot = reportSnapshot();
  return {
    ok: true,
    app: {
      name: app.getName(),
      version: app.getVersion(),
      packaged: app.isPackaged,
      locale: app.getLocale()
    },
    runtime: {
      platform: process.platform,
      arch: process.arch,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node
    },
    data: {
      exists: snapshot.exists,
      meta: snapshot.meta,
      seedPath: bundledReportPath()
    },
    dataUpdate: getDataUpdateStatus(),
    loginItem: readLoginItemSettings(),
    window: gadgetWindow && !gadgetWindow.isDestroyed()
      ? {
          bounds: gadgetWindow.getBounds(),
          visible: gadgetWindow.isVisible(),
          expanded: isPanelExpanded
        }
      : null
  };
}

function writeClipboardText(text) {
  if (typeof text !== "string" || !text.trim()) {
    return { ok: false, error: "INVALID_TEXT" };
  }

  clipboard.writeText(text);
  return { ok: true };
}

function registerIpcHandlers() {
  ipcMain.handle("report:read", async (event) => {
    assertTrustedSender(event);
    return readLatestReport();
  });

  ipcMain.handle("report:refresh", async (event) => {
    assertTrustedSender(event);
    return readLatestReport();
  });

  ipcMain.handle("data-update:get", (event) => {
    assertTrustedSender(event);
    return getDataUpdateStatus();
  });

  ipcMain.handle("data-update:set-enabled", (event, enabled) => {
    assertTrustedSender(event);
    return setDataAutoUpdateEnabled(enabled);
  });

  ipcMain.handle("data-update:run", async (event) => {
    assertTrustedSender(event);
    return runDataUpdate("manual");
  });

  ipcMain.handle("window:expand", (event) => {
    assertTrustedSender(event);
    return expandWindow();
  });

  ipcMain.handle("window:collapse", (event) => {
    assertTrustedSender(event);
    return collapseWindow();
  });

  ipcMain.handle("window:reset-position", (event) => {
    assertTrustedSender(event);
    return resetWindowPosition();
  });

  ipcMain.handle("window:drag-start", (event, payload) => {
    assertTrustedSender(event);
    return beginCustomDrag(payload);
  });

  ipcMain.on("window:drag-move", (event, payload) => {
    assertTrustedSender(event);
    moveCustomDrag(payload);
  });

  ipcMain.handle("window:drag-end", (event) => {
    assertTrustedSender(event);
    return endCustomDrag();
  });

  ipcMain.handle("app:quit", (event) => {
    assertTrustedSender(event);
    return quitGadget();
  });

  ipcMain.handle("diagnostics:read", (event) => {
    assertTrustedSender(event);
    return readAppDiagnostics();
  });

  ipcMain.handle("clipboard:write-text", (event, text) => {
    assertTrustedSender(event);
    return writeClipboardText(text);
  });

  ipcMain.handle("login-item:get", (event) => {
    assertTrustedSender(event);
    return readLoginItemSettings();
  });

  ipcMain.handle("login-item:set", (event, enabled) => {
    assertTrustedSender(event);
    return setLoginItemEnabled(enabled);
  });
}

function createWindow() {
  windowShown = false;
  isPanelExpanded = false;
  gadgetWindow = new BrowserWindow({
    ...defaultBallBounds(),
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  gadgetWindow.setAlwaysOnTop(true, "floating");
  gadgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  gadgetWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  gadgetWindow.webContents.on("will-navigate", (event) => event.preventDefault());
  gadgetWindow.webContents.on("will-attach-webview", (event) => event.preventDefault());

  gadgetWindow.once("ready-to-show", showGadgetWindow);
  gadgetWindow.webContents.once("did-finish-load", showGadgetWindow);
  setTimeout(showGadgetWindow, 1200);
  gadgetWindow.on("closed", () => {
    gadgetWindow = null;
    isPanelExpanded = false;
  });

  gadgetWindow.loadFile(path.join(__dirname, "src", "index.html"));
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", handleSecondInstance);

  app.whenReady().then(async () => {
    if (process.platform === "darwin") {
      app.dock?.hide();
      app.setActivationPolicy("accessory");
    }

    writePidFile();
    await ensureWritableReportSeed();
    loadDataUpdateSettings();
    registerIpcHandlers();
    createWindow();
    startReportWatcher();
    await startDataUpdater();
    registerGlobalShortcut();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => app.quit());
}

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  stopDataUpdater();
  stopReportWatcher();
  cleanupPidFile();
});
