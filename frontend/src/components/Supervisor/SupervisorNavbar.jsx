import React from "react";
import { Search, UserCircle } from "lucide-react";

const SupervisorNavbar = () => {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-blue-600 font-bold text-xl">ProcessControl</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar"
            className="pl-9 pr-3 py-2 border rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <UserCircle className="text-gray-600" size={32} />
      </div>
    </header>
  );
};

export default SupervisorNavbar;