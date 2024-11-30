// middleware/logger.js
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Pasa el control al siguiente middleware
}

module.exports = logger;
