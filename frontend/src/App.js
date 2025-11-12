import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// === Componentes principales ===
import AuthPage from "./components/AuthPage";
import AdminDashboard from "./components/DashboardAdmin";
import SupervisorDashboard from "./components/DashboardSupervisor";
import RevisorDashboard from "./components/DashboardRevisor";

// === Componentes del Supervisor ===
import SupervisorLayout from "./components/Supervisor/SupervisorLayout";
import ProcesosSupervisor from "./components/Supervisor/ProcesosSupervisor";
import ReportesSupervisor from "./components/Supervisor/ReportesSupervisor";
import DetalleProceso from "./components/Supervisor/DetalleProceso";

// === Componentes del Revisor ===
import RevisorLayout from "./components/Revisor/RevisorLayout";
import CrearReporte from "./components/Revisor/CrearReporte"; // Asegúrate que exista este archivo

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de autenticación */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboards generales */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* === Rutas del Revisor con layout propio === */}
        <Route path="/revisor" element={<RevisorLayout />}>
          <Route index element={<RevisorDashboard />} />
          <Route path="crear-reporte" element={<CrearReporte />} />
        </Route>

        {/* === Rutas del Supervisor con layout propio === */}
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="procesos" element={<ProcesosSupervisor />} />
          <Route path="reportes" element={<ReportesSupervisor />} />
          <Route path="proceso/:id" element={<DetalleProceso />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
