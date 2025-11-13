import React from "react";
import Layout from "../components/Layout";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const rol = user.rol;

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Panel de {rol?.charAt(0).toUpperCase() + rol?.slice(1)}
      </h2>

      {rol === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card titulo="Usuarios registrados" valor="34" cambio="+8%" color="green" />
          <Card titulo="Reportes activos" valor="12" cambio="+2%" color="blue" />
          <Card titulo="Procesos en revisión" valor="5" cambio="-1%" color="red" />
        </div>
      )}

      {rol === "supervisor" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card titulo="Incidencias abiertas" valor="12" cambio="+5%" color="blue" />
          <Card titulo="Procesos activos" valor="5" cambio="-2%" color="red" />
          <Card titulo="Reportes generados" valor="8" cambio="+12%" color="green" />
        </div>
      )}

      {rol === "revisor" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card titulo="Tareas asignadas" valor="10" cambio="+3%" color="blue" />
          <Card titulo="Pendientes por revisar" valor="7" cambio="-1%" color="red" />
          <Card titulo="Revisiones completadas" valor="15" cambio="+6%" color="green" />
        </div>
      )}
    </Layout>
  );
};

const Card = ({ titulo, valor, cambio, color }) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-100">
      <h3 className="text-gray-600 font-medium">{titulo}</h3>
      <p className={`text-4xl font-bold mt-2 ${colorClasses[color]}`}>{valor}</p>
      <span className={`text-sm ${colorClasses[color]}`}>{cambio}</span>
    </div>
  );
};

export default Dashboard;
