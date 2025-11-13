import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
