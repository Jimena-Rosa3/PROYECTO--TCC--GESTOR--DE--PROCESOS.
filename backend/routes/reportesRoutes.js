const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reporte');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// === Obtener todos los reportes (solo supervisores) ===
router.get('/', authMiddleware, authorizeRoles('supervisor'), async (req, res) => {
  try {
    const reportes = await Reporte.find().populate('creadoPor', 'nombre correo rol');
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reportes', error: error.message });
  }
});

// === Aprobar reporte ===
router.put('/:id/aprobar', authMiddleware, authorizeRoles('supervisor'), async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    reporte.estado = 'Aprobado';
    reporte.comentarioSupervisor = req.body.comentario || '';
    reporte.fechaRevision = new Date();
    await reporte.save();

    res.json({ message: 'Reporte aprobado exitosamente', reporte });
  } catch (error) {
    res.status(500).json({ message: 'Error al aprobar reporte', error: error.message });
  }
});

// === Rechazar reporte ===
router.put('/:id/rechazar', authMiddleware, authorizeRoles('supervisor'), async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    reporte.estado = 'Rechazado';
    reporte.comentarioSupervisor = req.body.comentario || '';
    reporte.fechaRevision = new Date();
    await reporte.save();

    res.json({ message: 'Reporte rechazado exitosamente', reporte });
  } catch (error) {
    res.status(500).json({ message: 'Error al rechazar reporte', error: error.message });
  }
});

// === Devolver reporte al revisor ===
router.put('/:id/devolver', authMiddleware, authorizeRoles('supervisor'), async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    reporte.estado = 'En Revisión';
    reporte.comentarioSupervisor = req.body.comentario || '';
    reporte.fechaRevision = new Date();
    await reporte.save();

    res.json({ message: 'Reporte devuelto para revisión', reporte });
  } catch (error) {
    res.status(500).json({ message: 'Error al devolver reporte', error: error.message });
  }
});

module.exports = router;