import axios from "axios";

// Configuración base de Axios para todas las peticiones
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar automáticamente el token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;