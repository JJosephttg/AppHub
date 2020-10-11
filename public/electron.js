const { app, BrowserWindow} = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  const database = require('./DatabaseUtility');
  
  mainWindow = new BrowserWindow({ 
    width: 720, height: 680, minWidth: 600, webPreferences: { nodeIntegration: true }
  });

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
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
