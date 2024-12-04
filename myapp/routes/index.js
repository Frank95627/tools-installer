var express = require('express');
var router = express.Router();
const { notes } = require('../db/db'); // Asegúrate de importar tus datos

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Ruta de búsqueda */
router.get('/search', function(req, res, next) {
  const { query, title, content, date, tags } = req.query;
  console.log(req.query); // Para depuración

  if (!query && !title && !content && !date && !tags) {
    return res.status(400).json({ error: 'Faltan parámetros de búsqueda' });
  }

  let results = notes;

  if (query) {
    results = results.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (title) {
    results = results.filter(note => 
      note.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (content) {
    results = results.filter(note => 
      note.content.toLowerCase().includes(content.toLowerCase())
    );
  }

  if (date) {
    results = results.filter(note => 
      new Date(note.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );
  }

  if (tags) {
    const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
    results = results.filter(note => 
      note.tags && note.tags.some(tag => tagsArray.includes(tag.toLowerCase()))
    );
  }

  res.render('results', { results });
});

module.exports = router;
