const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./itemsdb.sqlite', (err) => {
    if(err) {
        console.err('Deu erro!');
    } else {
        console.log('Deu certo!');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    descricao TEXT,
    dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP)`, (err) => {
        if (err) {
            console.error('Deu erro ao criar a tabela');
        }
});

app.post("/items", (req,res)=>{
    const  {name , descricao } = req.body;
    const query = `INSERT INTO items(name, descricao) VALUES (?,?)`// ?? para impedir ataques maliciosos

    db.all(query, [name, descricao], (err) => {
        if (err){
            res.status(400).json({message : err.message});

        }else {
            res.status(201).json({id: this.lastID , name , descricao});
        }

    })
    
});

app.get('/items', (req,res) => {
    const query = "SELECT * FROM  items";
    db.run(query,[],(err,rows)=>{
        if(err){
            console.error({message:err.message});
        }else{
            res.status(200).json(rows);
        }
    })

});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
