const electron = require('electron');
const fs = require('fs');
const childProcess = require('child_process');
const path = require('path');
const { dialog, ipcMain } = electron;

// Opens a file dialog and returns the selected path
ipcMain.handle("ProcessUtility-OpenFileDialog", (event, args) => {
    return new Promise(resolve => {
      dialog.showOpenDialog({ properties: ["openFile", "showHiddenFiles"]}).then(response => {
        if(response.canceled) {
          resolve({canceled: true, filePaths: null});
          return;
        }
        resolve({canceled: false, filePaths: response.filePaths});
      });
    });
});

// Opens a dialog and gets image data associated with a file. Returns an object stating if the operation was canceled,
// and the result data if no error occurred/wasn't canceled. If there is an error, it is rejected and a error dialog is
// presented to the user.
ipcMain.handle("ProcessUtility-GetImageData", (event, args) => {
    return new Promise((resolve, reject) => {
        const knownImageTypes = ['png', 'jpg', 'jpeg', 'gif', 'ico', 'webp', 'bmp'];
        dialog.showOpenDialog({
            filters: [{name: "Images", extensions: knownImageTypes}], 
            properties: ["openFile", "showHiddenFiles"]
        }).then(response => {
            if(response.canceled) {
              resolve({canceled: true, result: null});
              return;
            }

            let filePath = response.filePaths[0];
            let type = path.extname(filePath).trimLeft(".");

            if(type == "ico") type = "x-ico";
            else if (type == "jpeg") type = "jpg";
            else if(knownImageTypes.indexOf(type) == -1) type = "text/plain";

            resolve({canceled: false, result: `data:image/${type};base64,${fs.readFileSync(filePath, {encoding: 'base64'})}`});
        });
    });
});

//Run specified application
ipcMain.handle("ProcessUtility-RunApp", (event, app) => {
  return new Promise((resolve, reject) => {
    try {
      childProcess.spawn(app.AppPath, [app.LaunchArgs], {detached: true, shell: true});
    } catch(error) {
      dialog.showErrorBox("Launch App", `Failed to launch app: ${err}`);
      resolve(err);
    }
  });
});