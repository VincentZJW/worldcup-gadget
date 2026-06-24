"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = Object.freeze({
  readReport: "report:read",
  refreshReport: "report:refresh",
  readDiagnostics: "diagnostics:read",
  writeClipboardText: "clipboard:write-text",
  expandWindow: "window:expand",
  collapseWindow: "window:collapse",
  resetWindowPosition: "window:reset-position",
  dragStart: "window:drag-start",
  dragMove: "window:drag-move",
  dragEnd: "window:drag-end",
  quitApp: "app:quit",
  reportChanged: "report:changed",
  shortcutShowBall: "shortcut:show-ball"
});

const gadgetAPI = Object.freeze({
  readLatestReport: () => ipcRenderer.invoke(CHANNELS.readReport),
  readDiagnostics: () => ipcRenderer.invoke(CHANNELS.readDiagnostics),
  writeClipboardText: (text) => ipcRenderer.invoke(CHANNELS.writeClipboardText, text),
  expandWindow: () => ipcRenderer.invoke(CHANNELS.expandWindow),
  collapseWindow: () => ipcRenderer.invoke(CHANNELS.collapseWindow),
  resetWindowPosition: () => ipcRenderer.invoke(CHANNELS.resetWindowPosition),
  refreshReport: () => ipcRenderer.invoke(CHANNELS.refreshReport),
  startWindowDrag: (point) => ipcRenderer.invoke(CHANNELS.dragStart, point),
  moveWindowDrag: (point) => ipcRenderer.send(CHANNELS.dragMove, point),
  endWindowDrag: () => ipcRenderer.invoke(CHANNELS.dragEnd),
  quitApp: () => ipcRenderer.invoke(CHANNELS.quitApp),
  onReportChanged: (handler) => {
    if (typeof handler !== "function") return () => {};
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(CHANNELS.reportChanged, listener);
    return () => ipcRenderer.removeListener(CHANNELS.reportChanged, listener);
  },
  onShortcutShowBall: (handler) => {
    if (typeof handler !== "function") return () => {};
    const listener = () => handler();
    ipcRenderer.on(CHANNELS.shortcutShowBall, listener);
    return () => ipcRenderer.removeListener(CHANNELS.shortcutShowBall, listener);
  }
});

contextBridge.exposeInMainWorld("gadgetAPI", gadgetAPI);
