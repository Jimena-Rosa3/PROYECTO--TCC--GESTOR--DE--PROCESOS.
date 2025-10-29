import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import AdminDashboard from "./components/DashboardAdmin";
import SupervisorDashboard from "./components/DashboardSupervisor";
import RevisorDashboard from "./components/DashboardRevisor";
import DashboardRevisor from "./pages/Revisor/DashboardRevisor";
import ProcesosSupervisor from "./components/Supervisor/ProcesosSupervisor";
import DetalleProceso from "./components/Supervisor/DetalleProceso";
import ReporteIncidencia from "./components/Supervisor/ReporteIncidencia"; 
import ReportesSupervisor from "./pages/Supervisor/ReportesSupervisor";

function App() {
  return (
    <Router>
      <Routes>

        {/* Página de autenticación */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboards por rol */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/revisor" element={<RevisorDashboard />} />
        <Route path="/revisor/dashboard" element={<DashboardRevisor />} />

        {/* Nuevas rutas del supervisor */}
        <Route path="/supervisor/procesos" element={<ProcesosSupervisor />} />
        <Route path="/supervisor/proceso/:id" element={<DetalleProceso />} />
        <Route path="/supervisor/reportar" element={<ReporteIncidencia />} />
        <Route path="/supervisor/reportes" element={<ReportesSupervisor />} />
        <Route path="/supervisor/reportes/nuevo" element={<ReporteIncidencia />} />
      </Routes>
    </Router>
  );
}

export default App;