const express = require("express");
const router = express.Router();
const Proceso = require("../models/Proceso");
const authMiddleware = require("../middleware/authMiddleware");

//  Obtener todos los procesos (con filtros opcionales)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { estado, severidad, buscar, ordenar } = req.query;
    let filtro = {};

    if (estado) filtro.estado = estado;
    if (severidad) filtro.severidad = severidad;
    if (buscar)
      filtro.nombre = { $regex: buscar, $options: "i" }; // búsqueda insensible a mayúsculas

    let sort = {};
    if (ordenar === "asc") sort.ultimaActualizacion = 1;
    else if (ordenar === "desc") sort.ultimaActualizacion = -1;

    const procesos = await Proceso.find(filtro)
      .populate("reportes")
      .sort(sort);

    res.json(procesos);
  } catch (error) {
    console.error("Error al obtener procesos:", error);
    res.status(500).json({ message: "Error al obtener procesos" });
  }
});

//  Crear un nuevo proceso
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { nombre, descripcion, severidad, estado } = req.body;

    const nuevoProceso = new Proceso({
      nombre,
      descripcion,
      severidad,
      estado,
      creadoPor: req.user.id,
    });

    await nuevoProceso.save();
    res.status(201).json({ message: "Proceso creado correctamente", proceso: nuevoProceso });
  } catch (error) {
    console.error("Error al crear proceso:", error);
    res.status(500).json({ message: "Error al crear proceso" });
  }
});

//  Obtener un proceso por ID (para detalle)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const proceso = await Proceso.findById(req.params.id).populate("reportes");
    if (!proceso) {
      return res.status(404).json({ message: "Proceso no encontrado" });
    }
    res.json(proceso);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el proceso" });
  }
});

//  Actualizar un proceso
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { nombre, descripcion, severidad, estado } = req.body;
    const procesoActualizado = await Proceso.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, severidad, estado, ultimaActualizacion: Date.now() },
      { new: true }
    );

    if (!procesoActualizado) {
      return res.status(404).json({ message: "Proceso no encontrado" });
    }

    res.json({ message: "Proceso actualizado correctamente", proceso: procesoActualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar proceso" });
  }
});

//  Eliminar un proceso
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const eliminado = await Proceso.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ message: "Proceso no encontrado" });
    }
    res.json({ message: "Proceso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar proceso" });
  }
});

module.exports = router;