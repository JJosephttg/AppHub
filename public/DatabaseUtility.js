const sqlite = require('sqlite3');
const electron = require('electron');
const { dialog, BrowserWindow, ipcMain } = electron;

let database;

const open = () => {
    database = new sqlite.Database("db.sqlite", (err) => {
        if(err) {
            dialog.showMessageBoxSync({
                title: "Database Error", 
                message: `Unable to open database: ${err}`
            });
            BrowserWindow.getAllWindows().forEach(x => x.close());
        }
    });

    let tableSchema = 
    `CREATE TABLE IF NOT EXISTS 'Categories' (
        "id"	INTEGER NOT NULL UNIQUE,
        "CategoryName"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
    ); CREATE TABLE IF NOT EXISTS 'Apps' (
        "id"	INTEGER UNIQUE,
        "AppName"	TEXT NOT NULL,
        "Category"	INTEGER,
        FOREIGN KEY("Category") REFERENCES "Categories"("id") ON DELETE CASCADE,
        PRIMARY KEY("id" AUTOINCREMENT)
    ); CREATE TABLE IF NOT EXISTS "Favorites" (
        "id"	INTEGER NOT NULL UNIQUE,
        "App_ID"	INTEGER NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT),
        FOREIGN KEY("App_ID") REFERENCES "Apps"("id") ON DELETE CASCADE
    );`;

    database.exec(tableSchema, error => {
        if(error) dialog.showMessageBoxSync({
            title: "Database Error", 
            message: `Unable to create database schema: ${error}`
        });
    });
}

const close = () => database.close();

ipcMain.handle("DBUtility-GetFavorites", (event, args) => {
    const sql = `
    SELECT Favorites.id, Apps.AppName FROM Apps, Favorites
    `;
    return new Promise(resolve => database.all(sql, (err, rows) => {
        resolve({ 
            error: err,
            result: rows 
        });
    }));
});


module.exports = {
    open: open,
    close: close
}