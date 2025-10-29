import React, { useEffect, useState } from "react";
import axios from "axios";

const SupervisorTable = () => {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProcesos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/procesos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProcesos(res.data);
      } catch (error) {
        console.error("Error al obtener procesos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcesos();
  }, [token]);

  const handleAprobar = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/procesos/${id}/aprobar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Proceso aprobado correctamente");
      window.location.reload();
    } catch (error) {
      alert("❌ Error al aprobar proceso");
      console.error(error);
    }
  };

  const handleRechazar = async (id) => {
    const motivo = prompt("Motivo del rechazo:");
    if (!motivo) return;
    try {
      await axios.put(
        `http://localhost:5000/api/procesos/${id}/rechazar`,
        { motivo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🚫 Proceso rechazado");
      window.location.reload();
    } catch (error) {
      alert("Error al rechazar proceso");
      console.error(error);
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando procesos...</p>;

  return (
    <div className="bg-white rounded-xl shadow-md mt-6">
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
          {procesos.map((p) => (
            <tr key={p._id} className="border-t hover:bg-gray-50">
              <td className="py-3 px-4">{p.nombre}</td>
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
                  {p.estado}
                </span>
              </td>
              <td className="py-3 px-4">
                {new Date(p.updatedAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 flex gap-3">
                {p.estado === "pendiente" && (
                  <>
                    <button
                      onClick={() => handleAprobar(p._id)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleRechazar(p._id)}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupervisorTable;