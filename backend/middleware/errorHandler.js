// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error('Error detectado:', err.stack || err.message);

  // Determinar el código de estado
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;