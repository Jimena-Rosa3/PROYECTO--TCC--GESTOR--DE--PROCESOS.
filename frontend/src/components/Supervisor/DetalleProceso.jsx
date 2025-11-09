import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
} from "lucide-react";

const DetalleProceso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(true);

  // Datos simulados por ahora
  useEffect(() => {
    // Aquí luego puedes conectar con tu backend usando axios
    const mockData = {
      id,
      nombre: "Control de Calidad - Lote B-92",
      descripcion:
        "Proceso de revisión y control de calidad del lote B-92 antes de su envío.",
      fechaInicio: "2025-10-10",
      estado: "En Revisión",
      severidad: "Alta",
      reportes: [
        {
          id: "INC-001254",
          descripcion: "Fallo en equipo de medición de humedad.",
          fecha: "2025-10-12",
          estado: "Pendiente",
        },
        {
          id: "INC-001255",
          descripcion: "Lectura fuera de rango en sensor óptico.",
          fecha: "2025-10-13",
          estado: "Aprobado",
        },
      ],
    };

    setTimeout(() => {
      setProceso(mockData);
      setLoading(false);
    }, 500);
  }, [id]);

  const estadoIconos = {
    Aprobado: <CheckCircle className="text-green-600" size={18} />,
    Rechazado: <XCircle className="text-red-600" size={18} />,
    "En Revisión": <AlertTriangle className="text-yellow-500" size={18} />,
    Pendiente: <Clock className="text-gray-500" size={18} />,
  };

  const estadoColores = {
    Aprobado: "bg-green-100 text-green-700",
    Rechazado: "bg-red-100 text-red-700",
    "En Revisión": "bg-yellow-100 text-yellow-700",
    Pendiente: "bg-gray-100 text-gray-700",
  };

  const handleAprobar = () => {
    alert("✅ Proceso aprobado correctamente.");
  };

  const handleRechazar = () => {
    alert("❌ Proceso rechazado correctamente.");
  };

  if (loading) return <p className="p-8 text-gray-500">Cargando proceso...</p>;

  return (
    <div className="p-8 animate-fadeIn">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft size={18} /> Volver
      </button>

      {/* Información principal */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {proceso.nombre}
        </h2>
        <p className="text-gray-600 mb-4">{proceso.descripcion}</p>

        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            <strong>ID:</strong> {proceso.id}
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            <strong>Severidad:</strong> {proceso.severidad}
          </span>
          <span
            className={`px-3 py-1 rounded-full ${estadoColores[proceso.estado]}`}
          >
            <strong>Estado:</strong> {proceso.estado}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            <strong>Fecha Inicio:</strong> {proceso.fechaInicio}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleAprobar}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <CheckCircle size={18} /> Aprobar Proceso
          </button>
          <button
            onClick={handleRechazar}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <XCircle size={18} /> Rechazar Proceso
          </button>
        </div>

        {/* Reportes relacionados */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Reportes relacionados
        </h3>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">ID REPORTE</th>
                <th className="p-3 text-left">DESCRIPCIÓN</th>
                <th className="p-3 text-left">FECHA</th>
                <th className="p-3 text-left">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {proceso.reportes.map((r) => (
                <tr
                  key={r.id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="p-3 font-medium text-gray-800">{r.id}</td>
                  <td className="p-3 text-gray-700">{r.descripcion}</td>
                  <td className="p-3 text-gray-600">{r.fecha}</td>
                  <td className="p-3">
                    <span
                      className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-sm font-medium ${estadoColores[r.estado]}`}
                    >
                      {estadoIconos[r.estado]} {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Animación suave al cargar
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-in-out;
}`;
document.head.appendChild(style);

export default DetalleProceso;