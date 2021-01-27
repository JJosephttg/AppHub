const { app, BrowserWindow} = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

require('../main-process/ProcessUtility');

let mainWindow;

function createWindow() {
  const database = require('../main-process/DatabaseUtility');
  
  mainWindow = new BrowserWindow({
    width: 720, height: 540, minWidth: 600, minHeight: 500, webPreferences: { nodeIntegration: true }, show: false
  });
  if(!isDev) mainWindow.setMenu(null);
  
  mainWindow.on("ready-to-show", mainWindow.show);
  
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "index.html")}`
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

