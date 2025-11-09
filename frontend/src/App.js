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

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de autenticación */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboards generales */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/revisor" element={<RevisorDashboard />} />

        {/* === Rutas del Supervisor con layout propio === */}
        <Route path="/supervisor" element={<SupervisorLayout />}>
          {/* Página principal del supervisor */}
          <Route index element={<SupervisorDashboard />} />
          
          {/* Subrutas */}
          <Route path="procesos" element={<ProcesosSupervisor />} />
          <Route path="reportes" element={<ReportesSupervisor />} />
          <Route path="/supervisor/proceso/:id" element={<DetalleProceso />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;