import { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles.css";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/usuarios");
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    if (user?.rol === "administrador") fetchUsuarios();
  }, [user]);

  return (
    <div className="dashboard-container">
      <h2>Bienvenido, {user?.nombre}</h2>
      <p>Rol: {user?.rol}</p>
      <button onClick={logout}>Cerrar sesión</button>

      {user?.rol === "administrador" && (
        <>
          <h3>Lista de usuarios</h3>
          <ul>
            {usuarios.map((u) => (
              <li key={u._id}>
                {u.nombre} - {u.correo} ({u.rol})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;
