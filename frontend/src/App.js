import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "./utils/axiosConfig";

// === Páginas de autenticación ===
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// === Dashboards ===
import Dashboard from "./pages/Dashboard"; // Dashboard general por rol

// === Layout base ===
import Navbar from "./components/Navbar";

const AppContent = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const location = useLocation();

  // Verificar token al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/users/verify", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setUsuario(res.data.usuario);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUsuario(null);
        })
        .finally(() => setCargando(false));
    } else {
      setCargando(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  // Mostrar loading mientras se verifica el usuario
  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Cargando...
      </div>
    );
  }

  // Componente para proteger rutas
  const ProtectedRoute = ({ children, roles }) => {
    if (!usuario) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(usuario.rol?.toLowerCase())) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Mostrar navbar solo dentro del dashboard
  const mostrarNavbar = usuario && location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {mostrarNavbar && <Navbar usuario={usuario} onLogout={handleLogout} />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setUsuario={setUsuario} />} />
        <Route path="/registro" element={<Registro />} />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["administrador", "supervisor", "revisor"]}>
              <Dashboard usuario={usuario} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 font-bold text-xl">
              404 - Página no encontrada
            </h1>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
