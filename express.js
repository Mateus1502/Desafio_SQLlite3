const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./itemsdb.sqlite', (err) => {
    if(err) {
        console.error('Deu erro!');
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

    db.run(query, [name, descricao], (err) => {
        if (err){
            res.status(400).json({message : err.message});

        }else {
            res.status(201).json({id: this.lastID , name , descricao});
        }

    })
    
});

app.get('/items', (req,res) => {
    const query = "SELECT * FROM  items";
    db.all(query,(err,rows)=>{
        if(err){
            console.error({'Não deu para achar', err.message})
            return res.status(400).json({message:err.message});
        }else{
            res.status(200).json(rows);
        }
    })

});

app.get('/items/:id',(req,res) =>{
    const {id} = req.params;
    const query = 'SELECT * FROM items WHERE id =?';
    db.get(query,[id], (err,row)=>{
        if (err){
            console.error({'Certeza que é isso que você quer?',err.message})
            return res.status(400).json({message:err.message})
        }else{
            res.status(200).json(row);
        }
    })
});

app.put('/items/:id', (req, res) => {
    const { id } = req.params;  
    const { name, descricao } = req.body; 
    const query = 'UPDATE items SET name = ?, descricao = ? WHERE id = ?';
    db.run(query, [name, descricao, id], function (err) {
        if (err) {
            console.error('Não funfou:', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Item não encontrado!' });
        }else{
        res.status(200).json({
            id,
            name,
            descricao
        });
}});
});

app.patch('/items/:id',(req,res)=>{
    const { id } = req.params;  
    const { name, descricao } = req.body; 
    const query = 'UPDATE items SET name = ?, descricao = ? WHERE id = ?';
    db.run(query, [name, descricao, id], function (err) {
        if (err) {
            console.error('Não funfou:', err.message);
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Que nem o mundial do Palmeiras, isso não foi encontrado' });
        }else{
        res.status(200).json({
            id,
            name,
            descricao
        });
}});
});

app.delete('/items/:id',(req,res)=>{
    const {id}=req.params;
    const query = 'DELETE FROM items WHERE id = ?';
    db.run(query,[id],function(err){
        if(err){
            console.error('Me recuso a deletar bro',err.message);
            return res.status(400).json({message:err.message});            
        }if(this.changes === 0){
            return res.status(404).json({message:'Não existe isso aqui'})
        }else{
            res.status(200).json({
                id
            })
        }
    })
})
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
