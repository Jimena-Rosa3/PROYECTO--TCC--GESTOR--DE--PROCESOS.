import React, { useState, useEffect, useRef } from "react";
import axios from "../../utils/axiosConfig";
import { Check, X, RotateCcw, Search } from "lucide-react";

const ReportesSupervisor = () => {
  const [reportes, setReportes] = useState([]);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRef = useRef(null);

  // === Obtener reportes desde el backend ===
  const fetchReportes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/reportes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.reportes || [];
      setReportes(data);
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const filteredReportes = reportes.filter((r) => {
    const matchQuery =
      r._id?.toLowerCase().includes(query.toLowerCase()) ||
      r.revisor?.nombre?.toLowerCase().includes(query.toLowerCase());
    const matchFilter =
      filter === "Todos" || r.estado?.toLowerCase() === filter.toLowerCase();
    return matchQuery && matchFilter;
  });

  const handleSelectReporte = (reporte) => {
    setSelectedReporte(reporte);
    setChatMessages(reporte.mensajes || []);
  };

  const handleAccion = async (accion) => {
    if (!selectedReporte) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/reportes/${selectedReporte._id}/${accion}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Reporte ${accion} con éxito ✅`);
      fetchReportes();
    } catch (error) {
      console.error(`Error al ${accion} reporte:`, error);
      alert(`Error al ${accion} reporte ❌`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedReporte) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/reportes/${selectedReporte._id}/mensajes`,
        { texto: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatMessages([...chatMessages, res.data]);
      setNewMessage("");
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ====== LISTA DE REPORTES ====== */}
      <aside className="w-1/3 border-r bg-white p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Bandeja de Incidencias
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          Revisa, valida y gestiona los reportes de tu equipo.
        </p>

        {/* Buscador */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por ID o nombre de revisor"
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["Todos", "Pendiente", "En Revisión", "Aprobado", "Rechazado"].map(
            (estado) => (
              <button
                key={estado}
                onClick={() => setFilter(estado)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === estado
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {estado}
              </button>
            )
          )}
        </div>

        {/* Lista */}
        {loading ? (
          <p className="text-gray-500 text-center mt-6">Cargando reportes...</p>
        ) : filteredReportes.length === 0 ? (
          <p className="text-gray-400 text-center italic mt-6">
            No hay reportes disponibles.
          </p>
        ) : (
          filteredReportes.map((rep) => (
            <div
              key={rep._id}
              onClick={() => handleSelectReporte(rep)}
              className={`p-4 rounded-lg border mb-2 cursor-pointer transition ${
                selectedReporte?._id === rep._id
                  ? "bg-blue-50 border-blue-300"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between text-sm">
                <p className="font-semibold text-gray-800">
                  {rep.codigo || rep._id}
                </p>
                <p className="text-gray-500">
                  {new Date(rep.fecha).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                Revisor: {rep.revisor?.nombre || "Sin asignar"}
              </p>
              <div className="flex gap-2 mt-1 text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    rep.severidad === "Crítica"
                      ? "bg-red-100 text-red-700"
                      : rep.severidad === "Media"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {rep.severidad || "Leve"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    rep.estado === "Pendiente"
                      ? "bg-gray-100 text-gray-700"
                      : rep.estado === "En Revisión"
                      ? "bg-blue-100 text-blue-700"
                      : rep.estado === "Aprobado"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {rep.estado}
                </span>
              </div>
            </div>
          ))
        )}
      </aside>

      {/* ====== DETALLE DEL REPORTE ====== */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedReporte ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedReporte.titulo}
              </h2>
              <p className="text-gray-500 text-sm">
                ID: {selectedReporte._id} | Revisor:{" "}
                {selectedReporte.revisor?.nombre} | Fecha:{" "}
                {new Date(selectedReporte.fecha).toLocaleDateString()}
              </p>
              <p className="mt-3 text-gray-700">
                {selectedReporte.descripcion || "Sin descripción detallada."}
              </p>
            </div>

            {/* Evidencias */}
            {selectedReporte.evidencias?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Evidencias</h3>
                <div className="flex gap-3 flex-wrap">
                  {selectedReporte.evidencias.map((ev, i) => (
                    <img
                      key={i}
                      src={ev.url || ev}
                      alt="Evidencia"
                      className="w-36 h-28 object-cover rounded-md border shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-3">
              <button
                onClick={() => handleAccion("aprobar")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                <Check size={18} /> Aprobar
              </button>
              <button
                onClick={() => handleAccion("rechazar")}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                <X size={18} /> Rechazar
              </button>
              <button
                onClick={() => handleAccion("devolver")}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
              >
                <RotateCcw size={18} /> Devolver
              </button>
            </div>

            {/* Chat */}
            <div>
              <h3 className="font-semibold mb-2">Comunicación</h3>
              <div className="bg-gray-100 p-4 rounded-md h-60 overflow-y-auto mb-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-2 flex ${
                      msg.remitente === "supervisor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-xs ${
                        msg.remitente === "supervisor"
                          ? "bg-blue-600 text-white"
                          : "bg-white border"
                      }`}
                    >
                      <p className="text-sm">{msg.texto}</p>
                      <span className="block text-[10px] opacity-70 mt-1">
                        {new Date(msg.fecha).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={chatRef}></div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border rounded-md px-3 py-2 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            Selecciona una incidencia para ver los detalles.
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportesSupervisor;