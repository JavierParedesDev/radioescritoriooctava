import { app, BrowserWindow, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}
let playerWindow;

app.whenReady().then(() => {
  playerWindow = new BrowserWindow({
      width: 0,
      height: 0,
      show: false,
      webPreferences: {
          nodeIntegration: true,
      },
  });

  playerWindow.loadURL('http://localhost:3000/player');
});

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
