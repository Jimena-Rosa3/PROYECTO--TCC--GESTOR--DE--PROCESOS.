import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Search, UserCircle, PlusCircle } from "lucide-react";

const DashboardSupervisor = () => {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    obtenerProcesos();
  }, []);

  const obtenerProcesos = async () => {
    try {
      const res = await axios.get("/procesos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProcesos(res.data);
    } catch (error) {
      console.error("Error al obtener procesos:", error);
    } finally {
      setLoading(false);
    }
  };

  const aprobarProceso = async (id) => {
    const comentario = prompt("Ingrese un comentario de aprobación (opcional):");
    try {
      await axios.put(
        `/procesos/${id}/aprobar`,
        { comentario },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Proceso aprobado correctamente");
      obtenerProcesos();
    } catch (error) {
      alert("Error al aprobar proceso");
      console.error("Error al aprobar:", error);
    }
  };

  const rechazarProceso = async (id) => {
    const comentario = prompt("Ingrese el motivo del rechazo:");
    if (!comentario) return;
    try {
      await axios.put(
        `/procesos/${id}/rechazar`,
        { comentario },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🚫 Proceso rechazado");
      obtenerProcesos();
    } catch (error) {
      alert("Error al rechazar proceso");
      console.error("Error al rechazar:", error);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Cargando procesos...</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🔹 Navbar superior */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-extrabold text-xl">ProcessControl</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar"
              className="pl-9 pr-3 py-2 border rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <UserCircle className="text-gray-600" size={32} />
        </div>
      </header>

      {/* 🔹 Contenido principal */}
      <main className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Panel de Gestión de Procesos
          </h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <PlusCircle size={18} />
            Crear Reporte de Incidencia
          </button>
        </div>

        {/* 🔹 Tabla */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Proceso</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-left">Última Actualización</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {procesos.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No hay procesos registrados
                  </td>
                </tr>
              ) : (
                procesos.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">{p.nombre}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.estado === "aprobado"
                            ? "bg-green-100 text-green-700"
                            : p.estado === "rechazado"
                            ? "bg-red-100 text-red-700"
                            : p.estado === "pendiente"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex gap-3">
                      {p.estado === "pendiente" && (
                        <>
                          <button
                            onClick={() => aprobarProceso(p._id)}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => rechazarProceso(p._id)}
                            className="text-red-600 font-semibold hover:underline"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      <button className="text-gray-600 hover:text-blue-600 font-semibold">
                        Ver Reportes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardSupervisor;