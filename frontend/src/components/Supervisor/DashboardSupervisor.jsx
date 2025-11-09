import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import SupervisorLayout from "./SupervisorLayout";

const DashboardSupervisor = () => {
  const [reportes, setReportes] = useState([]);

  const obtenerReportes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/reportes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportes(res.data);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    }
  };

  const actualizarEstado = async (id, estado) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/reportes/${id}/${estado}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      obtenerReportes();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  useEffect(() => {
    obtenerReportes();
  }, []);

  return (
    <SupervisorLayout>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Panel del Supervisor</h1>
      <div className="bg-white shadow rounded-xl p-6">
        {reportes.length === 0 ? (
          <p className="text-gray-500">No hay reportes registrados.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-3">Título</th>
                <th className="p-3">Proceso</th>
                <th className="p-3">Severidad</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{r.titulo}</td>
                  <td className="p-3">{r.proceso?.nombre || "N/A"}</td>
                  <td className="p-3">{r.severidad}</td>
                  <td className="p-3 capitalize">{r.estado}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => actualizarEstado(r._id, "aprobar")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => actualizarEstado(r._id, "rechazar")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SupervisorLayout>
  );
};

export default DashboardSupervisor;