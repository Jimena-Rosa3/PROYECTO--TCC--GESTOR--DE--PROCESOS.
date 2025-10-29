import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const ReporteIncidencia = () => {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [proceso, setProceso] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar procesos del backend
  useEffect(() => {
    const obtenerProcesos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/procesos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProcesos(res.data);
      } catch (error) {
        console.error("Error al cargar procesos:", error);
      }
    };
    obtenerProcesos();
  }, []);

  // Manejar envío
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !proceso || !severidad) {
      alert("Debes completar todos los campos obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("procesoRelacionado", proceso);
    formData.append("severidad", severidad);
    archivos.forEach((file) => formData.append("archivos", file));

    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      await axios.post("/reportes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Reporte enviado correctamente.");
      navigate("/supervisor/reportes"); // 👉 Redirección automática
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      alert("Error al enviar el reporte");
    } finally {
      setCargando(false);
    }
  };

  // Manejar archivos
  const handleFileChange = (e) => {
    setArchivos([...e.target.files]);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-display">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Reportar una Incidencia
        </h1>
        <p className="text-gray-500 mb-6">
          Por favor, proporcione tantos detalles como sea posible sobre la
          incidencia.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Detalles */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Detalles de la Incidencia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Título de la Incidencia
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ingrese un breve resumen de la incidencia"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Verificación de Proceso Relacionada
                </label>
                <select
                  value={proceso}
                  onChange={(e) => setProceso(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Seleccione un proceso</option>
                  {procesos.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Descripción Detallada
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describa la incidencia en detalle..."
                  className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                ></textarea>
              </div>
            </div>
          </section>

          {/* Severidad */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Clasificación por Severidad
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: "leve",
                  color: "green",
                  label: "Leve",
                  desc: "Incidencia menor, sin impacto significativo.",
                  icon: "✅",
                },
                {
                  id: "media",
                  color: "yellow",
                  label: "Media",
                  desc: "Impacto moderado, requiere seguimiento.",
                  icon: "⚠️",
                },
                {
                  id: "critica",
                  color: "red",
                  label: "Crítica",
                  desc: "Impacto severo, acción inmediata requerida.",
                  icon: "⛔",
                },
              ].map((nivel) => (
                <label
                  key={nivel.id}
                  className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center text-center transition ${
                    severidad === nivel.id
                      ? `border-${nivel.color}-500 bg-${nivel.color}-50`
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-3xl mb-2`}>{nivel.icon}</span>
                  <span
                    className={`font-semibold text-${nivel.color}-600 text-lg`}
                  >
                    {nivel.label}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{nivel.desc}</p>
                  <input
                    type="radio"
                    name="severidad"
                    value={nivel.id}
                    checked={severidad === nivel.id}
                    onChange={(e) => setSeveridad(e.target.value)}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Adjuntar archivos */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Adjuntar Fotos / Evidencias
            </h2>

            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl text-gray-400">📎</span>
                <p className="text-gray-500">
                  <strong>Haga clic para subir</strong> o arrastre archivos aquí
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG o GIF (máx. 10MB)
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {archivos.length > 0 && (
              <ul className="mt-4 space-y-2">
                {Array.from(archivos).map((file, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-gray-100 rounded-lg p-3"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setArchivos(archivos.filter((_, idx) => idx !== i))
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/supervisor/reportes")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              className={`px-4 py-2 rounded-lg text-white ${
                cargando
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {cargando ? "Enviando..." : "Enviar Reporte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReporteIncidencia;