import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';

const ReportesSupervisor = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerReportes();
  }, []);

  // === Obtener todos los reportes ===
  const obtenerReportes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/reportes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportes(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      setLoading(false);
    }
  };

  // === Aprobar reporte ===
  const aprobarReporte = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/reportes/${id}/aprobar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerReportes();
    } catch (error) {
      console.error('Error al aprobar reporte:', error);
      alert('Error al aprobar el reporte.');
    }
  };

  // === Rechazar reporte ===
  const rechazarReporte = async (id) => {
    const motivo = prompt('Ingrese el motivo del rechazo:');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/reportes/${id}/rechazar`, { motivo }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerReportes();
    } catch (error) {
      console.error('Error al rechazar reporte:', error);
      alert('Error al rechazar el reporte.');
    }
  };

  if (loading) return <p className="p-8 text-gray-600">Cargando reportes...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-primary">Gestión de Reportes</h1>
      </div>

      {reportes.length === 0 ? (
        <p className="text-gray-600">No hay reportes disponibles.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Título</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Severidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Proceso</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportes.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{r.titulo}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        r.severidad === 'critica'
                          ? 'bg-red-100 text-red-600'
                          : r.severidad === 'media'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {r.severidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize font-semibold">
                    {r.estado === 'aprobado' && (
                      <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full">Aprobado</span>
                    )}
                    {r.estado === 'rechazado' && (
                      <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full">Rechazado</span>
                    )}
                    {r.estado === 'pendiente' && (
                      <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Pendiente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {r.procesoRelacionado?.nombre || '—'}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    {r.estado === 'pendiente' && (
                      <>
                        <button
                          onClick={() => aprobarReporte(r._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => rechazarReporte(r._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {r.estado !== 'pendiente' && (
                      <span className="text-gray-500 text-sm">Ya gestionado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportesSupervisor;