// src/utils/axiosConfig.js
import axios from "axios";

//  Configuración base de Axios
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/users",
  timeout: 12000,
});

//  Interceptor de solicitud: agrega token automáticamente
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Interceptor de respuesta: manejo global de errores
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        console.warn(" Token inválido o expirado. Cierre de sesión automático.");
        localStorage.removeItem("token");
        window.location.href = "/"; // opcional: redirige al login
      } else if (err.response.status === 404) {
        console.error(" Recurso no encontrado:", err.config.url);
      } else if (err.response.status >= 500) {
        console.error(" Error del servidor:", err.response.data?.message);
      }
    } else {
      console.error(" Error de conexión:", err.message);
    }
    return Promise.reject(err);
  }
);

export default instance;


