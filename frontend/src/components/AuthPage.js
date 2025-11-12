import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "revisor",
  });

  const navigate = useNavigate();

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // 🔹 LOGIN
        const res = await axios.post("/login", {
          correo: formData.correo,
          contraseña: formData.password, // 👈 importante: debe coincidir con tu backend
        });

        if (res.data?.token) {
          // Guardamos token y usuario
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

          // 🔀 Redirección según el rol
          const rol = res.data.usuario.rol;
          switch (rol) {
            case "administrador":
              navigate("/admin");
              break;
            case "supervisor":
              navigate("/supervisor");
              break;
            case "revisor":
              navigate("/revisor");
              break;
            default:
              navigate("/");
              break;
          }
        } else {
          alert("Credenciales incorrectas o respuesta inválida.");
        }

      } else {
        // 🔹 REGISTRO
        await axios.post("/register", {
          nombre: formData.nombre,
          correo: formData.correo,
          contraseña: formData.password,
          rol: formData.rol,
        });
        alert("✅ Cuenta creada exitosamente. Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error en autenticación:", error.response || error);
      const msg =
        error.response?.data?.message ||
        "❌ Error al procesar la solicitud. Inténtalo de nuevo.";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl flex max-w-5xl w-full overflow-hidden">
        {/* IZQUIERDA */}
        <div className="w-full md:w-1/2 p-10">
          {/* LOGO */}
          <div className="flex items-center gap-2 mb-8">
            <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-gray-800">ProcessControl</h1>
          </div>

          {/* BOTONES LOGIN/REGISTRO */}
          <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                isLogin
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                !isLogin
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* TITULO Y DESCRIPCIÓN */}
          {isLogin ? (
            <>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                Bienvenido de Nuevo
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Verificación y control de procesos en tiempo real.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                Crea tu Cuenta
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Regístrate para comenzar a gestionar tus procesos.
              </p>
            </>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre completo"
                  className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ingresa tu correo"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="revisor">Revisor</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition"
            >
              {isLogin ? "Iniciar Sesión" : "Registrarse"}
            </button>
          </form>

          {/* TEXTO FINAL */}
          {isLogin ? (
            <p className="text-center text-sm text-gray-500 mt-4">
              ¿No tienes una cuenta?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p className="text-center text-sm text-gray-500 mt-4">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>

        {/* DERECHA */}
        <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center p-10 text-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              Optimiza tu Flujo de Trabajo
            </h2>
            <p className="text-gray-600">
              Monitorea, verifica y aprueba procesos con eficiencia y control en
              tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
