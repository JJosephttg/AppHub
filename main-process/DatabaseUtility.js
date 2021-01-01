const Database = require('better-sqlite3');
const electron = require('electron');
const { dialog, BrowserWindow, ipcMain } = electron;

let database;

const appTable = "App";
const categoryTable = "Category";

const open = () => {
    if(database && database.open) database.close();

    try {
        database = new Database("db.sqlite", {verbose: console.log});
    } catch(error) {
        dialog.showMessageBoxSync({
            title: "Database Error", 
            message: `Unable to open database: ${err}`
        });
        BrowserWindow.getAllWindows().forEach(x => x.close());
    }

    try {
        database.prepare(
            `CREATE TABLE IF NOT EXISTS ${appTable} (
                "Id"            INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "AppName"       VARCHAR(200) NOT NULL UNIQUE,
                "AppPath"       TEXT NOT NULL,
                "CategoryId"	INTEGER,
                "LaunchArgs"    TEXT,
                "ImgSrc"	    BLOB,
                "IsFavorite"    INTEGER NOT NULL DEFAULT 0 CHECK(IsFavorite IN (0,1)),
                FOREIGN KEY(CategoryId) REFERENCES ${categoryTable}(CategoryName)
            )`
        ).run();
        
        
        database.prepare(
            `CREATE TABLE IF NOT EXISTS ${categoryTable} (
                "Id"           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "CategoryName" TEXT NOT NULL
            )`
        ).run();
    } catch(error) {
        dialog.showMessageBoxSync({
            title: "Database Error", 
            message: `Unable to create database schema: ${error}`
        });
    }
}

const close = () => database.close();

ipcMain.handle("DBUtility-GetCategories", (event, args) => {
    // TODO: Only get chunk at a time/when user types in something
    // Not very scalable, but it is unlikely someone would have 100s or 1000s of categories, so 
    // pull everything for now
    const sql = `SELECT CategoryName FROM ${categoryTable} ORDER BY CategoryName`;
    try { 
        return { result: database.prepare(sql).all() }; } 
    catch(error) {
        dialog.showErrorBox("Database Error", `Unable to retrieve categories from database: ${error}`);
        return { error: error };
    }
});

ipcMain.handle("DBUtility-GetFavorites", (event, args) => {
    // TODO: Only get chunk at a time
    const sql = `SELECT * FROM ${appTable} 
                WHERE isFavorite = 1 
                ORDER BY AppName
                ${args ? `LIMIT ${args}` : null}`;

    try { 
        return { result: database.prepare(sql).all() }; } 
    catch(error) {
        dialog.showErrorBox("Database Error", `Unable to retrieve app favorites: ${error}`);
        return { error: error };
    }
});

ipcMain.handle("DBUtility-SaveApp", (event, app) => {
    let sql = "", 
        sqlParams = {
            appId: app.AppId,
            appName: app.AppName,
            appCategory: app.CategoryName,
            appPath: app.AppPath,
            launchArgs: app.LaunchArgs || null,
            imgSrc: app.ImgSrc || null,
            isFavorite: app.IsFavorite ?? 0,
    };

    // Insert category if it exists/isn't empty
    let insertCategory = database.prepare(
        `INSERT OR IGNORE INTO ${categoryTable} (CategoryName) VALUES($appCategory)`);

    // insert app
    let appInsertSql = `INSERT INTO ${appTable} (${app.AppId ? "Id," : ""}AppName,AppPath,LaunchArgs,ImgSrc,IsFavorite,CategoryId)
        ${app.CategoryName ? "SELECT " : "VALUES("}${app.AppId ? "$appId," : ""}$appName,$appPath,$launchArgs,$imgSrc,$isFavorite,
        ${app.CategoryName ? `Id FROM ${categoryTable} WHERE CategoryName = $appCategory` : "NULL)"} `;
    
    if(app.AppId) { //If appid exists, we are updating it/modifying it, otherwise, we must assume we are inserting
        appInsertSql += `ON CONFLICT(Id) DO UPDATE SET Id=excluded.Id, AppName=excluded.AppName, AppPath=excluded.AppPath, 
                LaunchArgs=excluded.LaunchArgs, ImgSrc=excluded.ImgSrc, IsFavorite=excluded.IsFavorite, CategoryId=excluded.CategoryId`;
    }
    console.log(sqlParams);
    let insertApp = database.prepare(appInsertSql);
    
    try {
        database.transaction(params => {
            if(app.CategoryName) insertCategory.run(params);
            insertApp.run(params);
        })(sqlParams);
    } catch(error) {
        dialog.showErrorBox("Database Error", `Unable to save app: ${error}`);
        return error;
    }
});



module.exports = {
    open: open,
    close: close
}