"use strict";

const { app, BrowserWindow, dialog, globalShortcut, ipcMain, screen } = require("electron");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const BALL_SIZE = 64;
const PANEL_WIDTH = 420;
const PANEL_HEIGHT = 620;
const SCREEN_MARGIN = 20;
const GLOBAL_SHOW_BALL_SHORTCUT = "Control+Alt+W";
const REPORT_PATH = path.resolve(__dirname, "..", "data", "latest.json");
const PID_FILE = path.join(os.tmpdir(), "worldcup-floating-gadget.pid");

let gadgetWindow = null;
let windowShown = false;
let dragState = null;
let isPanelExpanded = false;
let ownsPidFile = false;

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

async function readLatestReport() {
  let raw;
  try {
    raw = await fs.readFile(REPORT_PATH, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return { ok: false, error: "NOT_FOUND" };
    }
    return { ok: false, error: "READ_FAILED" };
  }

  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false, error: "INVALID_JSON" };
    }
    return { ok: true, data };
  } catch (_error) {
    return { ok: false, error: "INVALID_JSON" };
  }
}

function assertTrustedSender(event) {
  if (!gadgetWindow || event.sender !== gadgetWindow.webContents) {
    throw new Error("Untrusted IPC sender");
  }
}

async function showFullDashboardPlaceholder() {
  if (!gadgetWindow) return { ok: false, action: "missing-window" };
  await dialog.showMessageBox(gadgetWindow, {
    type: "info",
    title: "查看 Dashboard 网页",
    message: "完整 Dashboard 网页接口已预留",
    detail: "后续可以在这里接入项目根目录的完整 dashboard 页面或本地服务。当前版本不会打开外部网页，也不会联网。",
    buttons: ["知道了"],
    defaultId: 0,
    cancelId: 0,
    noLink: true
  });
  return { ok: true, action: "dashboard-placeholder" };
}

async function showBallActionsDialog() {
  if (!gadgetWindow) return { ok: false, action: "missing-window" };
  const result = await dialog.showMessageBox(gadgetWindow, {
    type: "question",
    title: "世界杯悬浮球",
    message: "悬浮球操作",
    detail: "你可以退出悬浮球，或预留跳转到完整 dashboard 网页的接口。",
    buttons: ["查看网页（预留）", "退出悬浮球", "取消"],
    defaultId: 0,
    cancelId: 2,
    noLink: true
  });

  if (result.response === 0) {
    return showFullDashboardPlaceholder();
  }

  if (result.response === 1) {
    quitGadget();
    return { ok: true, action: "quit" };
  }

  return { ok: true, action: "cancel" };
}

function quitGadget() {
  app.quit();
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

  ipcMain.handle("window:expand", (event) => {
    assertTrustedSender(event);
    return expandWindow();
  });

  ipcMain.handle("window:collapse", (event) => {
    assertTrustedSender(event);
    return collapseWindow();
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

  ipcMain.handle("ball:actions-dialog", async (event) => {
    assertTrustedSender(event);
    return showBallActionsDialog();
  });

  ipcMain.handle("dashboard:open", async (event) => {
    assertTrustedSender(event);
    return showFullDashboardPlaceholder();
  });

  ipcMain.handle("app:quit", (event) => {
    assertTrustedSender(event);
    return quitGadget();
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

  app.whenReady().then(() => {
    if (process.platform === "darwin") {
      app.dock?.hide();
      app.setActivationPolicy("accessory");
    }

    writePidFile();
    registerIpcHandlers();
    createWindow();
    registerGlobalShortcut();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => app.quit());
}

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  cleanupPidFile();
});
