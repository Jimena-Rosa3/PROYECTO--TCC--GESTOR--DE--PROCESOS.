import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Login from "./components/Login";
import Register from "./components/Register";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardSupervisor from "./components/DashboardSupervisor";
import DashboardRevisor from "./components/DashboardRevisor";
import Header from "./components/Header";

// 🔒 Componente de protección de rutas
const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role && user.rol !== role) {
    return <Navigate to={`/${user.rol}`} />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Página de Login */}
          <Route path="/" element={<Login />} />

          {/* Página de Registro */}
          <Route path="/register" element={<Register />} />

          {/* Dashboards protegidos según el rol */}
          <Route
            path="/administrador"
            element={
              <PrivateRoute role="administrador">
                <DashboardAdmin />
              </PrivateRoute>
            }
          />

          <Route
            path="/supervisor"
            element={
              <PrivateRoute role="supervisor">
                <DashboardSupervisor />
              </PrivateRoute>
            }
          />

          <Route
            path="/revisor"
            element={
              <PrivateRoute role="revisor">
                <DashboardRevisor />
              </PrivateRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;