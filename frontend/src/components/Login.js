import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { correo, password });
      const data = res.data;

      login({
        token: data.token,
        nombre: data.usuario.nombre,
        correo: data.usuario.correo,
        rol: data.usuario.rol,
      });

      // Redirigir según el rol del usuario
      if (data.usuario.rol === "administrador") {
        navigate("/dashboard-admin");
      } else if (data.usuario.rol === "supervisor") {
        navigate("/dashboard-supervisor");
      } else if (data.usuario.rol === "revisor") {
        navigate("/dashboard-revisor");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMensaje(error.response?.data?.message || "Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Entrar</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p>
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;