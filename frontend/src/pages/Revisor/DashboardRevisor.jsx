import React, { useState } from "react";
import api from "../../api/axiosConfig"; 
import axios from 'axios';

const DashboardRevisor = () => {
  const [formData, setFormData] = useState({
    nombreProceso: "",
    descripcion: "",
    tipo: "recepción",
    severidad: "baja",
    evidencia: "",
  });

  const [mensaje, setMensaje] = useState("");

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/procesos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMensaje("Proceso registrado correctamente");
      setFormData({
        nombreProceso: "",
        descripcion: "",
        tipo: "recepción",
        severidad: "baja",
        evidencia: "",
      });
    } catch (error) {
      console.error("Error registrando el proceso:", error);
      setMensaje("Ocurrió un error al registrar el proceso");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Registro de Proceso
        </h2>

        <label className="block mb-2 font-semibold">Nombre del proceso</label>
        <input
          type="text"
          name="nombreProceso"
          value={formData.nombreProceso}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block mb-2 font-semibold">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block mb-2 font-semibold">Tipo</label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        >
          <option value="recepción">Recepción</option>
          <option value="despacho">Despacho</option>
        </select>

        <label className="block mb-2 font-semibold">Severidad</label>
        <select
          name="severidad"
          value={formData.severidad}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>

        <label className="block mb-2 font-semibold">Evidencia (URL)</label>
        <input
          type="text"
          name="evidencia"
          value={formData.evidencia}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full border rounded p-2 mb-3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar Proceso
        </button>

        {mensaje && (
          <p className="text-center mt-3 font-medium text-gray-700">
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
};

export default DashboardRevisor;