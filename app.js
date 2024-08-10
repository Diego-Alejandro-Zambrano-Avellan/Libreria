const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configuración de HBS
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar datos del formulario
app.use(express.urlencoded({ extended: false }));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_libros'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos');
});

// Rutas
app.get('/', (req, res) => {
  let sql = 'SELECT * FROM libros';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render('index', {
      libros: result
    });
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
app.post('/add', (req, res) => {
    const { titulo, genero } = req.body;
    let sql = 'INSERT INTO libros (titulo, genero) VALUES (?, ?)';
    db.query(sql, [titulo, genero], (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });

  // En app.js
app.post('/edit', (req, res) => {
    const { id, titulo, genero } = req.body;
    let sql = 'UPDATE libros SET titulo = ?, genero = ? WHERE id = ?';
    db.query(sql, [titulo, genero, id], (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });

  app.post('/delete', (req, res) => {
    const { id } = req.body;
    let sql = 'DELETE FROM libros WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
  app.get('/filter', (req, res) => {
    const { genero } = req.query;
    let sql = 'SELECT * FROM libros WHERE genero = ?';
    db.query(sql, [genero], (err, result) => {
      if (err) throw err;
      res.render('index', {
        libros: result
      });
    });
  });
