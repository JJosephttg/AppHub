const { app, ipcMain, dialog, BrowserWindow} = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  const database = require('./DatabaseUtility');
  
  mainWindow = new BrowserWindow({ 
    width: 720, height: 680, minWidth: 600, webPreferences: { nodeIntegration: true }, show: false
  });
  
  mainWindow.on("ready-to-show", mainWindow.show);

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => {
    database.close();
    mainWindow = null
  });
  
  database.open();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

ipcMain.handle("FileSystem-OpenFileDialog", (event, args) => {
  return new Promise(resolve => {
    dialog.showOpenDialog({ properties: ["openFile", "showHiddenFiles"]}).then(response => {
      if(response.canceled) {
        resolve({canceled: true, filePaths: null});
        return;
      }
      resolve({canceled: false, filePaths: response.filePaths});
    });
  });
})

