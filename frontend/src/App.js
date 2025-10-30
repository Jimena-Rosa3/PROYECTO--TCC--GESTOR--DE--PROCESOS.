import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "./components/AuthPage";
import AdminDashboard from "./components/DashboardAdmin";
import SupervisorDashboard from "./components/DashboardSupervisor";
import RevisorDashboard from "./components/DashboardRevisor";

import SupervisorLayout from "./components/Supervisor/SupervisorLayout";
import ProcesosSupervisor from "./components/Supervisor/ProcesosSupervisor";
import ReporteIncidencia from "./components/Supervisor/ReporteIncidencia";
import ReportesSupervisor from "./pages/Supervisor/ReportesSupervisor"; 
import DetalleProceso from "./components/Supervisor/DetalleProceso";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de autenticación */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboards generales */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/revisor" element={<RevisorDashboard />} />
        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />

        {/* === Sección del Supervisor con layout persistente === */}
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="procesos" element={<ProcesosSupervisor />} />
          <Route path="proceso/:id" element={<DetalleProceso />} />
          <Route path="reportes" element={<ReportesSupervisor />} />
          <Route path="reportar" element={<ReporteIncidencia />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;