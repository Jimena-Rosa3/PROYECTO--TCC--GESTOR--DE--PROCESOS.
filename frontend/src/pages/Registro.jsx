import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axiosConfig";
import "../styles.css"; // 👈 importa el CSS clásico que ya tienes

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "revisor",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    try {
      await axios.post("/users/register", formData);
      setMensaje("✅ Cuenta creada correctamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "❌ Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Crear Cuenta</h2>

      {error && (
        <p style={{ color: "red", background: "#ffeaea", padding: "8px", borderRadius: "6px" }}>
          {error}
        </p>
      )}
      {mensaje && (
        <p style={{ color: "green", background: "#eaffea", padding: "8px", borderRadius: "6px" }}>
          {mensaje}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
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
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          required
        >
          <option value="revisor">Revisor</option>
          <option value="supervisor">Supervisor</option>
          <option value="administrador">Administrador</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Registro;
