 import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import {
  Search,
  ChevronDown,
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

/**
 * ProcesosSupervisor (scroll infinito corregido)
 */
const ProcesosSupervisor = () => {
  const [procesos, setProcesos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [orden, setOrden] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(true);
  const [cargando, setCargando] = useState(false);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const requestedPagesRef = useRef(new Set()); // evita pedir la misma página varias veces
  const navigate = useNavigate();

  // función de obtención de datos (segura)
  const obtenerProcesos = async (page = 1) => {
    // evita requests duplicadas
    if (cargando || requestedPagesRef.current.has(page)) return;

    setCargando(true);
    requestedPagesRef.current.add(page);

    try {
      const params = {
        page,
        limit: 6,
        ...(estadoFiltro ? { estado: estadoFiltro } : {}),
        ...(orden ? { ordenar: orden } : {}),
        ...(busqueda ? { buscar: busqueda } : {}),
      };

      const res = await axios.get("/procesos", { params });
      // soporta backend que devuelva { procesos: [...], totalPaginas } o simplemente arreglo
      const nuevos = Array.isArray(res.data) ? res.data : res.data.procesos || [];

      // Si page === 1 reemplazamos la lista, si no, concatenamos
      setProcesos((prev) => (page === 1 ? nuevos : [...prev, ...nuevos]));

      // Si la respuesta trae menos que el limit, no hay más páginas
      if (nuevos.length < 6) {
        setHayMas(false);
      } else {
        setHayMas(true);
      }
    } catch (err) {
      console.error("Error al obtener procesos:", err);
      // si ocurre error, para no quedar en bucle, marcamos que NO hay más (opcional)
      // setHayMas(false);
    } finally {
      setCargando(false);
    }
  };

  // Observer: cuando el loader entra en vista aumentamos página (solo si hayMas y no cargando)
  const handleObserver = useCallback(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting && hayMas && !cargando) {
        // Pedimos la siguiente página
        setPagina((p) => p + 1);
      }
    },
    [hayMas, cargando]
  );

  // Configura el observer y lo desconecta/limpia correctamente
  useEffect(() => {
    // Cleanup anterior
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = { root: null, rootMargin: "200px", threshold: 0.5 };
    observerRef.current = new IntersectionObserver(handleObserver, options);

    const currentLoader = loaderRef.current;
    if (currentLoader) observerRef.current.observe(currentLoader);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver, loaderRef.current]);

  // Cuando cambian los filtros o búsqueda reiniciamos paginación
  useEffect(() => {
    // reset
    requestedPagesRef.current.clear();
    setPagina(1);
    setHayMas(true);
    obtenerProcesos(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFiltro, orden, busqueda]);

  // Cuando pagina cambia (y no es la página inicial después de filtro), pedir más
  useEffect(() => {
    if (pagina === 1) return; // ya fue pedido al cambiar filtros
    obtenerProcesos(pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  // Renders auxiliares
  const renderEstadoIcon = (estado) => {
    switch (estado) {
      case "Aprobado":
        return <CheckCircle className="text-green-500 inline-block mr-1" size={18} />;
      case "Rechazado":
        return <XCircle className="text-red-500 inline-block mr-1" size={18} />;
      case "En Revisión":
        return <Clock className="text-yellow-500 inline-block mr-1" size={18} />;
      case "Pendiente":
        return <Clock className="text-gray-500 inline-block mr-1" size={18} />;
      default:
        return null;
    }
  };

  const renderSeveridad = (nivel) => {
    const colores = {
      Alta: "bg-red-100 text-red-700",
      Media: "bg-yellow-100 text-yellow-700",
      Baja: "bg-green-100 text-green-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          colores[nivel] || "bg-gray-100 text-gray-600"
        }`}
      >
        {nivel}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Gestión de Procesos</h1>
          <p className="text-gray-500 text-sm">Controla tus procesos y reportes de manera eficiente</p>
        </div>

        <button
          onClick={() => navigate("/supervisor/reportar")}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all shadow-md"
        >
          <PlusCircle size={18} />
          Crear Reporte de Incidencia
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-8"
            >
              <option value="">Filtrar por Estado</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Pendiente">Pendiente</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-8"
            >
              <option value="">Ordenar por Fecha</option>
              <option value="desc">Más recientes</option>
              <option value="asc">Más antiguos</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        <div className="relative w-60">
          <Search size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">PROCESO</th>
              <th className="px-6 py-3 text-left">SEVERIDAD</th>
              <th className="px-6 py-3 text-left">ESTADO</th>
              <th className="px-6 py-3 text-left">ÚLTIMA ACTUALIZACIÓN</th>
              <th className="px-6 py-3 text-left">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {procesos.length > 0 ? (
              procesos.map((p) => (
                <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                  <td className="px-6 py-3 font-medium">{p.nombre}</td>
                  <td className="px-6 py-3">{renderSeveridad(p.severidad)}</td>
                  <td className="px-6 py-3 flex items-center">
                    {renderEstadoIcon(p.estado)}
                    <span>{p.estado}</span>
                  </td>
                  <td className="px-6 py-3">
                    {p.ultimaActualizacion ? new Date(p.ultimaActualizacion).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => navigate(`/supervisor/proceso/${p._id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver Reportes
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                  No hay procesos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Loader infinito */}
      <div ref={loaderRef} className="flex justify-center py-6">
        {cargando ? (
          <div className="flex items-center gap-2 text-gray-500 animate-pulse">
            <Clock size={18} className="text-blue-500" />
            Cargando más procesos...
          </div>
        ) : (
          !hayMas && procesos.length > 0 && (
            <div className="text-sm text-gray-500">Has llegado al final</div>
          )
        )}
      </div>
    </div>
  );
};

export default ProcesosSupervisor;