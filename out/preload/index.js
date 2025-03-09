"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {};
let playerWindow;
electron.app.whenReady().then(() => {
  playerWindow = new electron.BrowserWindow({
    width: 0,
    height: 0,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  playerWindow.loadURL("http://localhost:3000/player");
});
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
