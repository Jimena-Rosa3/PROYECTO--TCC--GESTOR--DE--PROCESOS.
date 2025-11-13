// src/utils/socket.js
import { io } from "socket.io-client";

// Conecta el frontend con el servidor backend
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Usa WebSocket directamente (más estable)
  reconnection: true,        // Permite reconectar automáticamente
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log(" Conectado al servidor de sockets:", socket.id);
});

socket.on("disconnect", () => {
  console.warn(" Desconectado del servidor de sockets");
});

export default socket;
