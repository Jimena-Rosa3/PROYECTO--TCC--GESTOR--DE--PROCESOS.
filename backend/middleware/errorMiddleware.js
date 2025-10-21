// middleware/errorMiddleware.js
function errorHandler(err, req, res, next) {
  console.error('Error detectado:', err);

  // Si el error tiene un código de estado, úsalo
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
}

module.exports = errorHandler;