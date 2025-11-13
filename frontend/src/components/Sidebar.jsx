import React from "react";
import { Home, FileText, Users, ClipboardList, LogOut, AlertTriangle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = {
    administrador: [
      { name: "Dashboard", path: "/dashboard", icon: <Home /> },
      { name: "Usuarios", path: "/usuarios", icon: <Users /> },
      { name: "Procesos", path: "/procesos", icon: <ClipboardList /> },
      { name: "Reportes", path: "/reportes", icon: <FileText /> },
    ],
    supervisor: [
      { name: "Dashboard", path: "/dashboard", icon: <Home /> },
      { name: "Incidencias", path: "/incidencias", icon: <AlertTriangle /> },
      { name: "Procesos", path: "/procesos", icon: <ClipboardList /> },
      { name: "Reportes", path: "/reportes", icon: <FileText /> },
    ],
    revisor: [
      { name: "Dashboard", path: "/dashboard", icon: <Home /> },
      { name: "Tareas", path: "/tareas", icon: <ClipboardList /> },
      { name: "Reportes", path: "/reportes", icon: <FileText /> },
    ],
  };

  const items = menuItems[user?.rol] || [];

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout?.();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-lg flex flex-col">
      {/* === Logo === */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">ProcessControl</h1>
      </div>

      {/* === Menu === */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* === Footer === */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
