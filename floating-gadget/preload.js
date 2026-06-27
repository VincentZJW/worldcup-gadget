"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = Object.freeze({
  readReport: "report:read",
  refreshReport: "report:refresh",
  getDataUpdateStatus: "data-update:get",
  setDataAutoUpdateEnabled: "data-update:set-enabled",
  runDataUpdate: "data-update:run",
  dataUpdateStatus: "data-update:status",
  readDiagnostics: "diagnostics:read",
  writeClipboardText: "clipboard:write-text",
  getLoginItem: "login-item:get",
  setLoginItem: "login-item:set",
  expandWindow: "window:expand",
  collapseWindow: "window:collapse",
  resetWindowPosition: "window:reset-position",
  dragStart: "window:drag-start",
  dragMove: "window:drag-move",
  dragEnd: "window:drag-end",
  openDownloadPage: "app:open-download-page",
  quitApp: "app:quit",
  reportChanged: "report:changed",
  shortcutShowBall: "shortcut:show-ball"
});

const gadgetAPI = Object.freeze({
  readLatestReport: () => ipcRenderer.invoke(CHANNELS.readReport),
  getDataUpdateStatus: () => ipcRenderer.invoke(CHANNELS.getDataUpdateStatus),
  setDataAutoUpdateEnabled: (enabled) =>
    ipcRenderer.invoke(CHANNELS.setDataAutoUpdateEnabled, enabled),
  runDataUpdate: () => ipcRenderer.invoke(CHANNELS.runDataUpdate),
  readDiagnostics: () => ipcRenderer.invoke(CHANNELS.readDiagnostics),
  writeClipboardText: (text) => ipcRenderer.invoke(CHANNELS.writeClipboardText, text),
  getLaunchAtLoginSettings: () => ipcRenderer.invoke(CHANNELS.getLoginItem),
  setLaunchAtLoginEnabled: (enabled) => ipcRenderer.invoke(CHANNELS.setLoginItem, enabled),
  expandWindow: () => ipcRenderer.invoke(CHANNELS.expandWindow),
  collapseWindow: () => ipcRenderer.invoke(CHANNELS.collapseWindow),
  resetWindowPosition: () => ipcRenderer.invoke(CHANNELS.resetWindowPosition),
  refreshReport: () => ipcRenderer.invoke(CHANNELS.refreshReport),
  startWindowDrag: (point) => ipcRenderer.invoke(CHANNELS.dragStart, point),
  moveWindowDrag: (point) => ipcRenderer.send(CHANNELS.dragMove, point),
  endWindowDrag: () => ipcRenderer.invoke(CHANNELS.dragEnd),
  openDownloadPage: () => ipcRenderer.invoke(CHANNELS.openDownloadPage),
  quitApp: () => ipcRenderer.invoke(CHANNELS.quitApp),
  onReportChanged: (handler) => {
    if (typeof handler !== "function") return () => {};
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(CHANNELS.reportChanged, listener);
    return () => ipcRenderer.removeListener(CHANNELS.reportChanged, listener);
  },
  onDataUpdateStatus: (handler) => {
    if (typeof handler !== "function") return () => {};
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(CHANNELS.dataUpdateStatus, listener);
    return () => ipcRenderer.removeListener(CHANNELS.dataUpdateStatus, listener);
  },
  onShortcutShowBall: (handler) => {
    if (typeof handler !== "function") return () => {};
    const listener = () => handler();
    ipcRenderer.on(CHANNELS.shortcutShowBall, listener);
    return () => ipcRenderer.removeListener(CHANNELS.shortcutShowBall, listener);
  }
});

contextBridge.exposeInMainWorld("gadgetAPI", gadgetAPI);
