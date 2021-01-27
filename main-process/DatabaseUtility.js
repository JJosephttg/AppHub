const Database = require('better-sqlite3');
const electron = require('electron');
const { app, dialog, BrowserWindow, ipcMain } = electron;

let database;

const appTable = "App";
const categoryTable = "Category";

const standardAppSelect = "Id, AppName, AppPath, LaunchArgs, ImgSrc, IsFavorite, CategoryName";

const open = () => {
    if(database && database.open) database.close();

    try {
        console.log(app.getPath("userData"));
        database = new Database(`${app.getPath("userData")}/db.sqlite`, {verbose: console.log});
    } catch(error) {
        dialog.showMessageBoxSync({
            title: "Database Error", 
            message: `Unable to open database: ${err}`
        });
        BrowserWindow.getAllWindows().forEach(x => x.close());
    }

    try {
        database.pragma("journal_mode = WAL");
        database.prepare(
            `CREATE TABLE IF NOT EXISTS ${appTable} (
                "Id"            INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "AppName"       VARCHAR(200) NOT NULL UNIQUE,
                "AppPath"       TEXT NOT NULL,
                "CategoryId"	INTEGER,
                "LaunchArgs"    TEXT,
                "ImgSrc"	    BLOB,
                "IsFavorite"    INTEGER NOT NULL DEFAULT 0 CHECK(IsFavorite IN (0,1)),
                FOREIGN KEY(CategoryId) REFERENCES ${categoryTable}(Id) ON DELETE CASCADE ON UPDATE CASCADE
            )`
        ).run();
        
        database.prepare(
            `CREATE TABLE IF NOT EXISTS ${categoryTable} (
                "Id"           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "CategoryName" TEXT NOT NULL UNIQUE
            )`
        ).run();

        // Trigger to automatically remove categories that are dereferenced
        // Unfortunately, there is no way to specify multiple event types without rewriting the logic :(
        const categoryCleanupTriggerLogic = (triggerName, eventType) => 
            `CREATE TRIGGER IF NOT EXISTS '${triggerName}' AFTER ${eventType}
            ${eventType == "UPDATE" ? "OF CategoryId" : ""} ON ${appTable}
            BEGIN
            DELETE FROM ${categoryTable} WHERE NOT EXISTS (SELECT 1 FROM ${appTable} a WHERE a.CategoryId = ${categoryTable}.Id);
            END`;
        
        database.prepare(categoryCleanupTriggerLogic("CategoryCleanup-UpdateTrigger", "UPDATE")).run();
        database.prepare(categoryCleanupTriggerLogic("CategoryCleanup-DeleteTrigger", "DELETE")).run();
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
    const sql = `SELECT CategoryName FROM ${categoryTable} ORDER BY CategoryName COLLATE NOCASE`;
    try { 
        return { result: database.prepare(sql).all() }; } 
    catch(error) {
        dialog.showErrorBox("Database Error", `Unable to retrieve categories from database: ${error}`);
        return { error: error };
    }
});

ipcMain.handle("DBUtility-GetFavorites", (event, options) => {
    // TODO: Only get chunk at a time
    const sql = `
        SELECT a.${standardAppSelect}
        FROM ${appTable} a INNER JOIN ${categoryTable} c ON (a.CategoryId = c.Id)
        WHERE isFavorite = 1 ${options.search ? "AND AppName LIKE '%'||@search||'%'" : ""}
        ORDER BY AppName COLLATE NOCASE
        ${options.limit ? `LIMIT @limit` : ""}
    `;

    try { 
        const data = {...options};
        return { result: database.prepare(sql).all(data) }; } 
    catch(error) {
        dialog.showErrorBox("Database Error", `Unable to retrieve app favorites: ${error}`);
        return { error: error };
    }
});

ipcMain.handle("DBUtility-GetCategoryPreviews", (event, options) => {
    const sql = `
        SELECT ${standardAppSelect} FROM (
            SELECT a.${standardAppSelect}, row_number() OVER (PARTITION BY CategoryId ORDER BY a.AppName COLLATE NOCASE) AS row
            FROM ${appTable} a INNER JOIN ${categoryTable} c ON (a.CategoryId = c.Id)
            ${options.search ? "WHERE AppName LIKE '%'||@search||'%'" : ""}
            ORDER BY c.CategoryName COLLATE NOCASE  
        ) WHERE row <= @limit
    `;
    
    const data = {...options}
    try { return { result: database.prepare(sql).all(data)} } 
    catch(error) {
        dialog.showErrorBox("Database Error", `Unable to get category previews: ${error}`);
        return { error: error};
    }
});

ipcMain.handle("DBUtility-GetApps", (event, category, options) => {
    const sql = `
        SELECT a.${standardAppSelect} FROM ${appTable} a LEFT JOIN ${categoryTable} c ON (a.CategoryId = c.Id)
        WHERE ${category ? "CategoryName = @category" : "CategoryId IS NULL"} ${options.search ? "AND AppName LIKE '%'||@search||'%'" : ""}
        ORDER BY AppName COLLATE NOCASE
        ${options.limit ? `LIMIT @limit` : ""}
    `;

    try { 
        let data = {...options};
        if(category) data = {...data, category: category}
        return { result: database.prepare(sql).all(data) };
    } catch(error) {
        dialog.showErrorBox("Database Error", `Unable to get apps: ${error}`);
        return { error: error };
    }
});

ipcMain.handle("DBUtility-SaveApp", (event, app) => {
    let sqlParams = {
            appId: app.Id,
            appName: app.AppName,
            appCategory: app.CategoryName,
            appPath: app.AppPath,
            launchArgs: app.LaunchArgs || null,
            imgSrc: app.ImgSrc || null,
            isFavorite: app.IsFavorite ? 1 : 0,
    };

    // Insert category if it exists/isn't empty
    let insertCategory = database.prepare(
        `INSERT OR IGNORE INTO ${categoryTable} (CategoryName) VALUES($appCategory)`);

    // insert app
    let appInsertSql = `INSERT INTO ${appTable} (${app.Id ? "Id," : ""}AppName,AppPath,LaunchArgs,ImgSrc,IsFavorite,CategoryId)
        ${app.CategoryName ? "SELECT " : "VALUES("}${app.Id ? "$appId," : ""}$appName,$appPath,$launchArgs,$imgSrc,$isFavorite,
        ${app.CategoryName ? `Id FROM ${categoryTable} WHERE CategoryName = $appCategory` : "NULL)"} `;
    
    if(app.Id) { //If appid exists, we are updating it/modifying it, otherwise, we must assume we are inserting
        appInsertSql += `ON CONFLICT(Id) DO UPDATE SET AppName=excluded.AppName, AppPath=excluded.AppPath, 
                LaunchArgs=excluded.LaunchArgs, ImgSrc=excluded.ImgSrc, IsFavorite=excluded.IsFavorite, CategoryId=excluded.CategoryId`;
    }

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

ipcMain.handle("DBUtility-DeleteApp", (event, appId) => {
    try {
        database.prepare(`DELETE FROM ${appTable} WHERE Id = ?`).run(appId);
        return null;
    } catch(error) {
        dialog.showErrorBox("Database Error", `Unable to delete app: ${error}`);
        return error;
    }
});



module.exports = {
    open: open,
    close: close
}