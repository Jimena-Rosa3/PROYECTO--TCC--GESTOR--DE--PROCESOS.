import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, PlusCircle, LogOut, Settings } from "lucide-react";

const RevisorLayout = () => {
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};

  const links = [
    { to: "/revisor", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/revisor/mis-reportes", label: "Mis Reportes", icon: <FileText size={20} /> },
    { to: "/revisor/crear-reporte", label: "Crear Reporte", icon: <PlusCircle size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-500 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-400">
          ⚙️ ProcessControl
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                location.pathname === link.to
                  ? "bg-white text-indigo-600 font-semibold"
                  : "text-indigo-100 hover:bg-indigo-600/40"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-400/30">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-md transition-all"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white border-b px-8 py-4 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Panel del Revisor</h1>

          <div className="flex items-center gap-4">
            <button className="hover:text-indigo-600 transition">
              <Settings size={22} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold uppercase">
                {usuario.nombre?.charAt(0) || "R"}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{usuario.nombre}</p>
                <p className="text-xs text-gray-500">{usuario.correo}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 bg-gray-50 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RevisorLayout;
