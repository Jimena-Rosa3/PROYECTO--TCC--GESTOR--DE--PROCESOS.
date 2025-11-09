// src/utils/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 12000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    // opcional: manejar 401 global
    if (err.response && err.response.status === 401) {
      console.warn("Unauthorized - token inválido o expirado");
      // puedes desloguear: localStorage.removeItem("token")
    }
    return Promise.reject(err);
  }
);

export default instance;     
