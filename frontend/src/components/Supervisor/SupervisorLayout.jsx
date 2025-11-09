import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart,
  Bell,
  LogOut,
  Settings,
} from "lucide-react";
import { io } from "socket.io-client";
import axios from "../../utils/axiosConfig";
import NotificationPanel from "./NotificationPanel";

const SupervisorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [notificaciones, setNotificaciones] = useState([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [tieneNuevas, setTieneNuevas] = useState(false);

  // === Datos del usuario (simulados) ===
  const user = {
    nombre: "Angie Jiménez",
    email: "supervisor@empresa.com",
  };

  // === Generar iniciales del usuario ===
  const getIniciales = (nombre) => {
    const partes = nombre.trim().split(" ");
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  };
  const iniciales = getIniciales(user.nombre);

  // === SOCKET.IO ===
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("connect", () => console.log("🟢 Conectado a Socket.io"));

    socket.on("nuevaNotificacion", (data) => {
      setNotificaciones((prev) => [data, ...prev]);
      setTieneNuevas(true);
    });

    return () => socket.disconnect();
  }, []);

  // === Cargar notificaciones ===
  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await axios.get("/notificaciones");
        if (Array.isArray(res.data)) {
          setNotificaciones(res.data);
        }
      } catch (err) {
        console.error("Error al obtener notificaciones:", err);
      }
    };
    fetchNotificaciones();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/notificaciones/${id}/vista`);
      setNotificaciones((prev) =>
        prev.map((n) => (n._id === id ? { ...n, vista: true } : n))
      );
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  };

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/supervisor" },
    { name: "Incidencias", icon: <FileText size={18} />, path: "/supervisor/reportes" },
    { name: "Revisores", icon: <Users size={18} />, path: "/supervisor/revisores" },
    { name: "Reportes", icon: <BarChart size={18} />, path: "/supervisor/reportes" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === SIDEBAR === */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          {/* Perfil del usuario */}
          <div className="flex flex-col items-center p-6 border-b">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-semibold shadow-sm">
              {iniciales}
            </div>
            <h1 className="text-lg font-semibold text-gray-800 mt-3 text-center">
              {user.nombre}
            </h1>
            <p className="text-sm text-gray-500 text-center">{user.email}</p>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col mt-4 space-y-1 px-3">
            {menu.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Ajustes + Cerrar sesión */}
        <div className="p-4 border-t space-y-2">
          <button
            onClick={() => navigate("/supervisor/ajustes")}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-all w-full"
          >
            <Settings size={18} /> Ajustes
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-all w-full"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="flex-1 relative">
        <header className="flex justify-between items-center px-8 py-4 bg-white border-b shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Panel del Supervisor</h2>

          {/* Botón de notificaciones */}
          <div className="flex items-center gap-4">
            <button
              className="relative"
              onClick={() => {
                setPanelVisible(!panelVisible);
                setTieneNuevas(false);
              }}
            >
              <Bell className="text-gray-700 hover:text-blue-600 transition-all" size={22} />
              {tieneNuevas && (
                <span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>

        {/* Panel de notificaciones */}
        <NotificationPanel
          visible={panelVisible}
          notificaciones={notificaciones}
          onClose={() => setPanelVisible(false)}
          onMarkRead={handleMarkAsRead}
        />
      </main>
    </div>
  );
};

export default SupervisorLayout;