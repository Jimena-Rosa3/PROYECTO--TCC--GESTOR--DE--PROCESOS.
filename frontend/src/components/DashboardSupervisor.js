import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";

const DashboardSupervisor = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <h1>Panel del Supervisor</h1>
      <p>Bienvenido, <strong>{user?.nombre}</strong></p>
      <p>Rol: <strong>{user?.rol}</strong></p>

      <div className="acciones">
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default DashboardSupervisor;