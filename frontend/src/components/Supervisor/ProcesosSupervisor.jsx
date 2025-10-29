import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProcesosSupervisor = () => {
  const [procesos, setProcesos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/api/procesos"; // tu backend

  useEffect(() => {
    const obtenerProcesos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProcesos(res.data);
      } catch (error) {
        console.error("Error al cargar los procesos:", error);
      }
    };
    obtenerProcesos();
  }, []);

  const filtrarProcesos = (estado) => {
    setFiltro(estado);
  };

  const procesosFiltrados =
    filtro === "Todos"
      ? procesos
      : procesos.filter((p) => p.estado === filtro);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-blue-600 text-3xl">✔</span>
          <h1 className="text-xl font-bold">ProcessControl</h1>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <div className="bg-gray-300 rounded-full h-10 w-10"></div>
        </div>
      </header>

      {/* Contenido */}
      <main className="px-10 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Panel de Gestión de Procesos</h2>
          <button
            onClick={() => navigate("/supervisor/reportar")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <span className="material-symbols-outlined text-sm">
              add_circle
            </span>
            Crear Reporte de Incidencia
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-4">
          {["Todos", "Pendiente", "En Revisión", "Aprobado", "Rechazado"].map(
            (estado) => (
              <button
                key={estado}
                onClick={() => filtrarProcesos(estado)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filtro === estado
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {estado}
              </button>
            )
          )}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3">Proceso</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Última actualización</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {procesosFiltrados.length > 0 ? (
                procesosFiltrados.map((proceso) => (
                  <tr
                    key={proceso._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium">
                      {proceso.nombre}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          proceso.estado === "Aprobado"
                            ? "bg-green-100 text-green-600"
                            : proceso.estado === "Rechazado"
                            ? "bg-red-100 text-red-600"
                            : proceso.estado === "En Revisión"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {proceso.estado}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(proceso.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-blue-600 text-center font-medium cursor-pointer hover:underline"
                      onClick={() => navigate(`/supervisor/proceso/${proceso._id}`)}
                    >
                      Ver Reportes
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No hay procesos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProcesosSupervisor;