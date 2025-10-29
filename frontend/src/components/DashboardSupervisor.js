import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";

const DashboardSupervisor = () => {
  const [procesos, setProcesos] = useState([]);

  useEffect(() => {
    obtenerProcesos();
  }, []);

  const obtenerProcesos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/procesos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProcesos(res.data);
    } catch (error) {
      console.error("Error al obtener procesos:", error);
    }
  };

  const aprobarProceso = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/procesos/${id}/aprobar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerProcesos();
    } catch (error) {
      console.error("Error al aprobar proceso:", error);
    }
  };

  const rechazarProceso = async (id) => {
    const motivo = prompt("Motivo del rechazo:");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/procesos/${id}/rechazar`, { motivo }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerProcesos();
    } catch (error) {
      console.error("Error al rechazar proceso:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Panel del Supervisor</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        {procesos.length === 0 ? (
          <p className="text-gray-500">No hay procesos pendientes.</p>
        ) : (
          procesos.map((p) => (
            <div
              key={p._id}
              className="border-b py-3 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{p.nombre}</h3>
                <p className="text-sm text-gray-600">
                  Creado por: {p.creadoPor?.nombre || "Desconocido"}
                </p>
                <p className="text-sm">
                  Estado: <span className="font-medium">{p.estado}</span>
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => aprobarProceso(p._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => rechazarProceso(p._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardSupervisor;