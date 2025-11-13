import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Bell } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notificacionesOpen, setNotificacionesOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3 sticky top-0 z-30">
      <h1 className="text-xl font-semibold text-gray-800">
        ProcessControl Dashboard
      </h1>

      <div className="flex items-center space-x-6">
        {/* 🔔 Botón de notificaciones */}
        <button
          className="relative"
          onClick={() => setNotificacionesOpen(!notificacionesOpen)}
        >
          <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
          <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
        </button>

        {/* 👤 Perfil de usuario */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <UserAvatar name={user?.nombre || "Usuario"} size={50} />
          <div className="hidden sm:block text-left">
            <p className="font-medium text-gray-800">{user?.nombre}</p>
            <p className="text-xs text-gray-500">{user?.rol}</p>
          </div>
        </div>

        {/* 🔽 Dropdown de usuario */}
        {isOpen && (
          <div className="absolute right-6 top-14 bg-white shadow-lg rounded-xl py-2 w-44 z-40 border">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Panel de notificaciones */}
      <NotificationPanel
        isOpen={notificacionesOpen}
        onClose={() => setNotificacionesOpen(false)}
      />
    </header>
  );
};

export default Navbar;
