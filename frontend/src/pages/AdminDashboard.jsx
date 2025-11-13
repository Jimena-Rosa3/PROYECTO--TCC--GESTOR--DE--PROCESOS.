import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dataUsuarios = [
  { mes: "Ene", usuarios: 12 },
  { mes: "Feb", usuarios: 15 },
  { mes: "Mar", usuarios: 22 },
  { mes: "Abr", usuarios: 28 },
  { mes: "May", usuarios: 35 },
  { mes: "Jun", usuarios: 40 },
];

const AdminDashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Panel del Administrador</h2>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-medium text-gray-700">Usuarios registrados</h3>
              <p className="text-3xl font-bold mt-2 text-blue-600">24</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-medium text-gray-700">Reportes activos</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">15</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-medium text-gray-700">Supervisores</h3>
              <p className="text-3xl font-bold mt-2 text-indigo-600">5</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-medium text-gray-700 mb-4">
              Crecimiento de Usuarios
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataUsuarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="usuarios"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
