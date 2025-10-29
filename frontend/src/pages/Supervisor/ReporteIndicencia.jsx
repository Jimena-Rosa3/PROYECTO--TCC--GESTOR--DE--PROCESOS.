import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const ReporteIncidencia = () => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [severidad, setSeveridad] = useState('Media');
  const [imagenes, setImagenes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);
      formData.append('severidad', severidad);
      imagenes.forEach((img) => formData.append('imagenes', img));

      await axios.post('/reportes', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/supervisor/reportes');
    } catch (error) {
      console.error('Error al crear el reporte:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-8">
        <h1 className="text-3xl font-black mb-6 text-gray-800 dark:text-white">
          Reportar una Incidencia
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border rounded-lg p-3 dark:bg-gray-800 dark:text-white"
              placeholder="Ej. Falla en la recepción del lote A-13"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded-lg p-3 dark:bg-gray-800 dark:text-white"
              placeholder="Describa la incidencia en detalle..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold mb-1">Severidad</label>
            <select
              value={severidad}
              onChange={(e) => setSeveridad(e.target.value)}
              className="w-full border rounded-lg p-3 dark:bg-gray-800 dark:text-white"
            >
              <option value="Leve">Leve</option>
              <option value="Media">Media</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Adjuntar Evidencias</label>
            <input
              type="file"
              multiple
              onChange={(e) => setImagenes([...e.target.files])}
              className="block w-full text-sm text-gray-500 dark:text-gray-400"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/supervisor/reportes')}
              className="px-4 py-2 bg-gray-200 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
            >
              Enviar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReporteIncidencia;