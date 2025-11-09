const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  proceso: { type: String, required: true },
  severidad: { type: String, enum: ['Alta', 'Media', 'Baja'], default: 'Media' },
  descripcion: { type: String, required: true },
  estado: { type: String, enum: ['Pendiente', 'En Revisión', 'Aprobado', 'Rechazado'], default: 'Pendiente' },
  comentarioSupervisor: { type: String },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaCreacion: { type: Date, default: Date.now },
  fechaRevision: { type: Date },
});

module.exports = mongoose.model('Reporte', reporteSchema);