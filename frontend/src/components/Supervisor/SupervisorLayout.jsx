import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const SupervisorLayout = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-600">
          ProcessReview
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4">
          <Link
            to="/supervisor/procesos"
            className="block px-3 py-2 rounded hover:bg-blue-600 transition"
          >
            Procesos
          </Link>
          <Link
            to="/supervisor/reportes"
            className="block px-3 py-2 rounded hover:bg-blue-600 transition"
          >
            Reportes
          </Link>
          <Link
            to="/supervisor/reportar"
            className="block px-3 py-2 rounded hover:bg-blue-600 transition"
          >
            Reportar Incidencia
          </Link>
        </nav>

        <button
          onClick={cerrarSesion}
          className="m-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white font-bold"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-xl font-semibold text-gray-700">
            Panel del Supervisor
          </h1>
          <p className="text-gray-500">Bienvenido </p>
        </header>

        {/* Aquí se mostrarán las vistas internas */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SupervisorLayout;