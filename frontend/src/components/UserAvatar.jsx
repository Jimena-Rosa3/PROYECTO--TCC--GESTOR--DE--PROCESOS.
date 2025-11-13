import React from "react";
import { motion } from "framer-motion";

//  Función para generar un color de fondo según el nombre
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
};

// ✨ Componente Avatar animado
const UserAvatar = ({ name, size = 64 }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const bgColor = stringToColor(name || "Usuario");

  return (
    <motion.div
      className="flex items-center justify-center rounded-full text-white font-bold shadow-lg"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size / 2.8,
      }}
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          `0 0 0px ${bgColor}`,
          `0 0 10px ${bgColor}`,
          `0 0 0px ${bgColor}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      {initials}
    </motion.div>
  );
};

export default UserAvatar;
