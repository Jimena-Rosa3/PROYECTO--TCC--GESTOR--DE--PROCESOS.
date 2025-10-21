import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/register.css";

const Register = () => {
  const { user, logout } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", { nombre, correo, password, rol });
      setMensaje(res.data.message || "Registro exitoso");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="register-container">
      {user && (
        <div className="user-header">
          <h3>
            Bienvenida, <span>{user.nombre}</span> ({user.rol})
          </h3>
        </div>
      )}

      <div className="register-card">
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={rol} onChange={(e) => setRol(e.target.value)} required>
            <option value="">Selecciona un rol</option>
            <option value="administrador">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="revisor">Revisor</option>
          </select>

          <button type="submit">Registrar</button>
        </form>

        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/" className="link">
            Inicia sesión aquí
          </Link>
        </p>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        {user && (
          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;