import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  // Si no hay usuario logueado → redirigir al login
  if (!user) {
    return <Navigate to="/" />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene → redirigir
  if (role && user.rol !== role) {
    return <Navigate to={`/${user.rol === "administrador" ? "dashboard-admin" : user.rol === "revisor" ? "dashboard-revisor" : "dashboard-general"}`} />;
  }

  // Si pasa las validaciones → renderiza la vista protegida
  return children;
};

export default PrivateRoute;