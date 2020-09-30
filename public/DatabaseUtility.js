const sqlite = require('sqlite3');
const electron = require('electron');
const { dialog, BrowserWindow } = electron;

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
        FOREIGN KEY("Category") REFERENCES "Categories"("id"),
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

module.exports = {
    open: open,
    close: close
}