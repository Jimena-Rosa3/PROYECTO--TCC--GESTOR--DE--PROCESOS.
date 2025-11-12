import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

const DetalleReporteRevisor = () => {
  const { id } = useParams();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const res = await axios.get(`/revisor/reportes/${id}`);
        setReporte(res.data);
      } catch (err) {
        console.error("Error al cargar reporte:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 animate-pulse">Cargando reporte...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">No se encontró el reporte.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Volver
        </button>
      </div>
    );
  }

  const getColor = (estado) => {
    switch (estado) {
      case "Aprobado":
        return "bg-green-100 text-green-700";
      case "Rechazado":
        return "bg-red-100 text-red-700";
      case "En Revisión":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getSeveridadColor = (nivel) => {
    switch (nivel) {
      case "Crítica":
        return "bg-red-100 text-red-700";
      case "Media":
        return "bg-yellow-100 text-yellow-700";
      case "Leve":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {reporte.titulo}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          ID: #{reporte._id.slice(-6)} • Fecha:{" "}
          {new Date(reporte.createdAt).toLocaleDateString("es-ES")}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getColor(
              reporte.estado
            )}`}
          >
            {reporte.estado}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeveridadColor(
              reporte.severidad
            )}`}
          >
            {reporte.severidad}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Descripción Detallada
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {reporte.descripcion || "Sin descripción detallada."}
          </p>
        </div>

        {/* Evidencias */}
        {reporte.evidencias && reporte.evidencias.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Evidencias
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {reporte.evidencias.map((img, i) => (
                <div
                  key={i}
                  className="relative border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={`http://localhost:5000/uploads/${img}`}
                    alt={`Evidencia ${i + 1}`}
                    className="w-full h-40 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Si no hay evidencias */}
        {!reporte.evidencias?.length && (
          <div className="flex flex-col items-center justify-center text-gray-400 py-10">
            <ImageIcon size={40} />
            <p className="mt-2 text-sm">No se adjuntaron evidencias.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleReporteRevisor;