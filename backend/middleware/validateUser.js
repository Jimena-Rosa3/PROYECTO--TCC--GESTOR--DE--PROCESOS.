// middleware/validateUser.js
const { body, validationResult } = require('express-validator');

// Validaciones para registrar usuario
const validarRegistro = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres'),

  body('correo')
    .isEmail().withMessage('Debe ser un correo electrónico válido'),

  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('rol')
    .isIn(['revisor', 'supervisor', 'administrador']).withMessage('El rol no es válido'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg)
      });
    }
    next();
  }
];

module.exports = { validarRegistro };
