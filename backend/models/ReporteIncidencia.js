const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  severidad: {
    type: String,
    enum: ['leve', 'media', 'critica'],
    required: true,
  },
  evidencia: [
    {
      type: String, // URLs o nombres de archivo
    },
  ],
  estado: {
    type: String,
    enum: ['pendiente', 'en revisión', 'aprobado', 'rechazado'],
    default: 'pendiente',
  },
  procesoRelacionado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proceso',
    required: true,
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  aprobadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  motivoRechazo: String,
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ReporteIncidencia', reporteSchema);