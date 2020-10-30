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

    let tableSchema = `
    CREATE TABLE IF NOT EXISTS 'Categories' (
        "id"	INTEGER NOT NULL UNIQUE,
        "CategoryName"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
    );    
    CREATE TABLE IF NOT EXISTS 'Apps' (
        "id"	INTEGER UNIQUE,
        "AppName"	TEXT NOT NULL,
        "Category"	INTEGER,
        "ImgSrc"	BLOB,
        "IsFavorite"	INTEGER NOT NULL DEFAULT 0 CHECK(IsFavorite IN (0,1)),
        FOREIGN KEY("Category") REFERENCES "Categories"("id") ON DELETE CASCADE,
        PRIMARY KEY("id" AUTOINCREMENT)
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
    // TODO: Only get chunk at a time
    const sql = `SELECT * FROM Apps WHERE isFavorite = TRUE`;

    return new Promise(resolve => database.all(sql, (err, rows) => resolve({ error: err, result: rows })));
});

ipcMain.handle("DBUtility-GetCategories", (event, args) => {
    // TODO: Only get chunk at a time/when user types in something
    // Not very scalable, but it is unlikely someone would have 100s or 1000s of categories, so 
    // pull everything for now
    const sql = `SELECT * FROM Categories`

    return new Promise(resolve => database.all(sql, (err, rows) => resolve({error: err, result: rows})));
});


module.exports = {
    open: open,
    close: close
}