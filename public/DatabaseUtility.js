const sqlite = require('sqlite3');
const electron = require('electron');
const { dialog, BrowserWindow } = electron;
const fs = require('fs');

let database;

const open = () => {
    let dbExists = false;
    if(fs.existsSync("db.sqlite")) dbExists = true;

    database = new sqlite.Database("db.sqlite", (err) => {
        if(err) {
            dialog.showMessageBoxSync({
                title: "Database Error", 
                message: `Unable to open database: ${err}`
            });
            BrowserWindow.getAllWindows().forEach(x => x.close());
        }
    });

    /*let sql = 
    `CREATE TABLE "Categories" (
        "id"	INTEGER NOT NULL UNIQUE,
        "CategoryName"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    CREATE TABLE "Apps"`;

    database.run(sql, (result, error) => {
        if(error) dialog.showMessageBoxSync({
            title: "Database Error", 
            message: `Unable to create database schema: ${error}`
        });
    });*/
}

const close = () => database.close();

module.exports = {
    open: open,
    close: close
}