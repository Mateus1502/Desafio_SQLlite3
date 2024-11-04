const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());
const db = new sqlite3.Database('./itemsdb.sqlite',(err) =>{
    if(err) {
        console.err('Avisei que ia dar merda');
    } else {
        console.log('Deu certo');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS items(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL 
    descricao TEXT 
    dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP) `), (err) => {
        if (err){
            console.err('Deu merda bro');
        } else {
            console.log('Deu tudo certo')
        }
    }
