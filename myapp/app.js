const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const axios = require('axios');
const createError = require('http-errors');

const customLogger = require('./middleware/logger');
const authenticateToken = require('./middleware/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');

const app = express();

// Claves API directamente en el código
const GOOGLE_API_KEY = 'AIzaSyAi86aJ-zvfDl6WK7EC6nQ18jqEV6Ihe4E';
const GOOGLE_CX = '75ce3dda8aebc4760';
const GEMINI_API_KEY = 'AlzaSyAhASA_yHkiKMGxicf 01ANTYUZSe8fhf2Y';

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware para el favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de control de caché
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por un año
  next();
});

app.use(customLogger);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/api/notes', notesRouter);

// Ruta para manejar la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la página principal');
});

// Ruta protegida
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Esta es una ruta protegida', user: req.user });
});

// Ruta de búsqueda ajustada
app.get('/search', async (req, res) => {
  const { query } = req.query;
  console.log('Parámetros de la consulta:', req.query); // Para depuración

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Faltan parámetros de búsqueda' });
  }

  try {
    console.log('Iniciando búsqueda...'); // Registro adicional

    // Realizar búsqueda en Google
    const googleResponse = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}`);
    const googleResults = googleResponse.data.items || [];
    console.log('Resultados de Google:', googleResults);

    // Realizar búsqueda en Gemini
    const geminiResponse = await axios.get(`https://api.gemini.com/v1/pubticker/${query}`, {
      headers: {
        'X-GEMINI-APIKEY': GEMINI_API_KEY
      }
    });
    const geminiResults = geminiResponse.data || {};
    console.log('Resultados de Gemini:', geminiResults);

    // Combinar resultados
    const results = {
      google: googleResults,
      gemini: geminiResults
    };

    console.log('Resultados Combinados:', results); // Imprimir resultados combinados para depuración

    // Verificar si hay resultados antes de renderizar la vista
    if (results.google.length === 0 && Object.keys(results.gemini).length === 0) {
      return res.status(404).json({ error: 'No se encontraron resultados para la búsqueda' });
    }

    res.render('results', { results });

  } catch (error) {
    console.error('Error al realizar la búsqueda:', error.message);
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

const port = process.env.PORT || 3001;
app.set('port', port);
const server = app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = app;
