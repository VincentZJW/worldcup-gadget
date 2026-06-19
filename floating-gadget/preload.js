"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = Object.freeze({
  readReport: "report:read",
  refreshReport: "report:refresh",
  expandWindow: "window:expand",
  collapseWindow: "window:collapse",
  showActionsWindow: "window:actions",
  dragStart: "window:drag-start",
  dragMove: "window:drag-move",
  dragEnd: "window:drag-end",
  showBallActionsDialog: "ball:actions-dialog",
  openFullDashboard: "dashboard:open",
  quitApp: "app:quit",
  shortcutShowBall: "shortcut:show-ball"
});

const gadgetAPI = Object.freeze({
  readLatestReport: () => ipcRenderer.invoke(CHANNELS.readReport),
  expandWindow: () => ipcRenderer.invoke(CHANNELS.expandWindow),
  collapseWindow: () => ipcRenderer.invoke(CHANNELS.collapseWindow),
  showActionsWindow: () => ipcRenderer.invoke(CHANNELS.showActionsWindow),
  refreshReport: () => ipcRenderer.invoke(CHANNELS.refreshReport),
  startWindowDrag: (point) => ipcRenderer.invoke(CHANNELS.dragStart, point),
  moveWindowDrag: (point) => ipcRenderer.send(CHANNELS.dragMove, point),
  endWindowDrag: () => ipcRenderer.invoke(CHANNELS.dragEnd),
  showBallActionsDialog: () => ipcRenderer.invoke(CHANNELS.showBallActionsDialog),
  openFullDashboard: () => ipcRenderer.invoke(CHANNELS.openFullDashboard),
  quitApp: () => ipcRenderer.invoke(CHANNELS.quitApp),
  onShortcutShowBall: (handler) => {
    if (typeof handler !== "function") return () => {};
    const listener = () => handler();
    ipcRenderer.on(CHANNELS.shortcutShowBall, listener);
    return () => ipcRenderer.removeListener(CHANNELS.shortcutShowBall, listener);
  }
});

contextBridge.exposeInMainWorld("gadgetAPI", gadgetAPI);
