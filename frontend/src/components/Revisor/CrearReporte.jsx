import React, { useState } from "react";
import axios from "../../utils/axiosConfig";
import { Camera, Upload, AlertCircle } from "lucide-react";

const CrearReporte = () => {
  const [formData, setFormData] = useState({
    proceso: "",
    severidad: "",
    descripcion: "",
  });
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const procesos = [
    "Logística y Cadena de Suministro",
    "Gestión de Almacén",
    "Recepción de Mercancía",
    "Despacho de Mercancía",
    "Verificación de Recepción",
    "Gestión de Inventario",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const data = new FormData();
      data.append("proceso", formData.proceso);
      data.append("severidad", formData.severidad);
      data.append("descripcion", formData.descripcion);
      if (imagen) data.append("imagen", imagen);

      await axios.post("/reportes", data, {
  headers: { "Content-Type": "multipart/form-data" },
});

      setMensaje("✅ Reporte enviado exitosamente.");
      setFormData({ proceso: "", severidad: "", descripcion: "" });
      setImagen(null);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al enviar el reporte. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <AlertCircle className="text-indigo-600" /> Reportar Nueva Incidencia
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Proceso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccione un Proceso
          </label>
          <select
            name="proceso"
            value={formData.proceso}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Seleccione --</option>
            {procesos.map((proc) => (
              <option key={proc} value={proc}>
                {proc}
              </option>
            ))}
          </select>
        </div>

        {/* Severidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severidad de la Incidencia
          </label>
          <select
            name="severidad"
            value={formData.severidad}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Seleccione --</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción de la Incidencia
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            placeholder="Describe brevemente lo ocurrido..."
          ></textarea>
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evidencia Fotográfica (opcional)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700">
              <Camera size={18} />
              <span>Subir Imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {imagen && (
              <div className="text-sm text-gray-600">
                <Upload size={16} className="inline mr-1" />
                {imagen.name}
              </div>
            )}
          </div>
        </div>

        {/* Botón */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition-all"
          >
            {loading ? "Enviando..." : "Enviar Reporte"}
          </button>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <p
            className={`mt-3 text-sm font-medium ${
              mensaje.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
};

export default CrearReporte;