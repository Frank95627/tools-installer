var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');
var serveFavicon = require('serve-favicon');
var customLogger = require('./middleware/logger');
var authenticateToken = require('./middleware/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware para el favicon
app.use(serveFavicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(customLogger);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// Ruta protegida
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Esta es una ruta protegida', user: req.user });
});

// **Ruta para obtener todas las notas**
const { notes } = require('./db/db');
app.get('/api/notes', (req, res) => {
  const result = notes;
  res.json(result);
});

// **Ruta para crear una nueva nota**
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  notes.push(newNote);
  res.status(201).json(newNote);
});

// **Ruta para actualizar una nota existente**
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const updatedNote = req.body;
  const noteIndex = notes.findIndex(note => note.id === parseInt(id));
  if (noteIndex !== -1) {
    notes[noteIndex] = updatedNote;
    res.json(updatedNote);
  } else {
    res.status(404).json({ error: 'Nota no encontrada' });
  }
});

// **Ruta para eliminar una nota**
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(note => note.id === parseInt(id));
  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    res.json({ message: 'Nota eliminada' });
  } else {
    res.status(404).json({ error: 'Nota no encontrada' });
  }
});

// Ruta de búsqueda
app.get('/search', async (req, res) => {
  const { type, query } = req.query;

  if (!type || !query) {
    return res.status(400).json({ error: 'Faltan parámetros de búsqueda' });
  }

  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/${type}`);
    const results = response.data.filter(item => {
      if (item.name) {
        return item.name.toLowerCase().includes(query.toLowerCase());
      }
      return false;
    });
    res.json(results);
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
