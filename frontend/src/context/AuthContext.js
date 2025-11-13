import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const nombre = localStorage.getItem("nombre");
    const correo = localStorage.getItem("correo");

    // Si hay token, devuelve todos los datos del usuario
    return token && rol && nombre && correo
      ? { token, rol, nombre, correo }
      : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("rol", userData.rol);
    localStorage.setItem("nombre", userData.nombre);
    localStorage.setItem("correo", userData.correo);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
    localStorage.removeItem("correo");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
