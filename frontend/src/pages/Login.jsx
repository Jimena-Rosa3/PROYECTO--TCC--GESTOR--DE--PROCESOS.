import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles.css"; // 

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/login", formData);
      const { token, usuario } = res.data;

      login({
        token,
        rol: usuario.rol,
        nombre: usuario.nombre,
        correo: usuario.correo,
      });

      // ✅ Redirige por rol
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>

      {error && (
        <p style={{ color: "red", background: "#ffeaea", padding: "8px", borderRadius: "6px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
