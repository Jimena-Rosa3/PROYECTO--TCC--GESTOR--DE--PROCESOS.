const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { body, validationResult } = require('express-validator');
const { validarRegistro } = require('../middleware/validateUser');

// REGISTRO DE USUARIO
router.post('/register', validarRegistro, async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validar rol permitido
    const rolesPermitidos = ['administrador', 'revisor', 'supervisor'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    // Verificar si ya existe el usuario
    const existeUsuario = await User.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear y guardar usuario nuevo
    const nuevoUsuario = new User({
      nombre,
      correo,
      password: hashedPassword,
      rol,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({
      message: 'Error en el registro',
      error: error.message,
    });
  }
});

// LOGIN DE USUARIO
router.post(
  '/login',
  [
    body('correo').isEmail().withMessage('Debe ser un correo válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  async (req, res) => {
    // Validar los errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errores.array().map(err => err.msg)
      });
    }

    try {
      const { correo, password } = req.body;

      const usuario = await User.findOne({ correo });
      if (!usuario) {
        return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
      }

      const esValida = await bcrypt.compare(password, usuario.password);
      if (!esValida) {
        return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
      }

      const token = jwt.sign(
        { id: usuario._id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en el login',
        error: error.message
      });
    }
  }
);
 

// LISTAR TODOS LOS USUARIOS (solo ADMIN)
router.get('/usuarios', authMiddleware, authorizeRoles('administrador'), async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// EDITAR USUARIO (solo ADMIN)
router.put('/usuarios/:id', authMiddleware, authorizeRoles('administrador'), async (req, res) => {
  try {
    const { nombre, correo, rol } = req.body;
    const usuarioActualizado = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, correo, rol },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

// ELIMINAR USUARIO (solo ADMIN)
router.delete('/usuarios/:id', authMiddleware, authorizeRoles('administrador'), async (req, res) => {
  try {
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id);

    if (!usuarioEliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router; //  ESTA LÍNEA DEBE IR AL FINAL