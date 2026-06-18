"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = Object.freeze({
  readReport: "report:read",
  refreshReport: "report:refresh",
  expandWindow: "window:expand",
  collapseWindow: "window:collapse",
  dragStart: "window:drag-start",
  dragMove: "window:drag-move",
  dragEnd: "window:drag-end",
  showBallActionsDialog: "ball:actions-dialog",
  openFullDashboard: "dashboard:open"
});

const gadgetAPI = Object.freeze({
  readLatestReport: () => ipcRenderer.invoke(CHANNELS.readReport),
  expandWindow: () => ipcRenderer.invoke(CHANNELS.expandWindow),
  collapseWindow: () => ipcRenderer.invoke(CHANNELS.collapseWindow),
  refreshReport: () => ipcRenderer.invoke(CHANNELS.refreshReport),
  startWindowDrag: (point) => ipcRenderer.invoke(CHANNELS.dragStart, point),
  moveWindowDrag: (point) => ipcRenderer.send(CHANNELS.dragMove, point),
  endWindowDrag: () => ipcRenderer.invoke(CHANNELS.dragEnd),
  showBallActionsDialog: () => ipcRenderer.invoke(CHANNELS.showBallActionsDialog),
  openFullDashboard: () => ipcRenderer.invoke(CHANNELS.openFullDashboard)
});

contextBridge.exposeInMainWorld("gadgetAPI", gadgetAPI);
