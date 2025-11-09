const mongoose = require("mongoose");

const procesoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    severidad: {
      type: String,
      enum: ["Baja", "Media", "Alta"],
      default: "Media",
    },
    estado: {
      type: String,
      enum: ["Pendiente", "En Revisión", "Aprobado", "Rechazado"],
      default: "Pendiente",
    },
    ultimaActualizacion: {
      type: Date,
      default: Date.now,
    },
    // Relación con reportes
    reportes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reporte",
      },
    ],
    // Usuario que creó el proceso (opcional)
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Proceso", procesoSchema);

