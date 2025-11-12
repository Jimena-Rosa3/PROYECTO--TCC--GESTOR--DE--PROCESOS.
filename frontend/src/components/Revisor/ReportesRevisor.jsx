import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReportesRevisor = () => {
  const [reportes, setReportes] = useState([]);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await axios.get("/revisor/reportes", {
          params: { search, estado, severidad, page: pagina },
        });
        setReportes(res.data.reportes || []);
        setTotalPaginas(res.data.totalPaginas || 1);
      } catch (err) {
        console.error("Error al cargar reportes:", err);
      }
    };
    fetchReportes();
  }, [search, estado, severidad, pagina]);

  const handleVerDetalles = (id) => navigate(`/revisor/reportes/${id}`);

  const estados = ["Pendiente", "En Revisión", "Aprobado", "Rechazado"];
  const niveles = ["Leve", "Media", "Crítica"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Reportes de Incidencias
        </h2>
        <button
          onClick={() => navigate("/revisor/crear-reporte")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          + Nuevo Reporte
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por ID o palabra clave..."
          className="border border-gray-300 rounded-lg px-3 py-2 w-72 focus:ring-2 focus:ring-blue-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="relative">
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Estado</option>
            {estados.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={severidad}
            onChange={(e) => setSeveridad(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Severidad</option>
            {niveles.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Tabla de reportes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-4 text-left">Incidencia</th>
              <th className="py-3 px-4 text-left">Severidad</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {reportes.length > 0 ? (
              reportes.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    #{r._id.slice(-6)} <br />
                    <span className="text-gray-500 text-xs">{r.descripcion}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        r.severidad === "Alta"
                          ? "bg-red-100 text-red-700"
                          : r.severidad === "Media"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.severidad}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(r.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        r.estado === "Aprobado"
                          ? "bg-green-100 text-green-700"
                          : r.estado === "Rechazado"
                          ? "bg-red-100 text-red-700"
                          : r.estado === "En Revisión"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleVerDetalles(r._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-6 text-center text-gray-500 italic"
                >
                  No hay reportes disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina((p) => p - 1)}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
        >
          ←
        </button>
        <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
          {pagina}
        </span>
        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina((p) => p + 1)}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ReportesRevisor;