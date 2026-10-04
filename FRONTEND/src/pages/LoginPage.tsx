import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import "../styles/auth.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    login,
  } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const irARecuperarContrasena = () => {
    navigate("/recuperar-contrasena");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      const usuario = await login({
        correo,
        contrasena,
      });

      if (usuario.rol === "ESTUDIANTE") {
        navigate("/estudiante", {
          replace: true,
        });
        return;
      }

      if (usuario.rol === "SECRETARIO") {
        navigate("/secretario", {
          replace: true,
        });
        return;
      }

      if (usuario.rol === "ADMINISTRADOR") {
        navigate("/administrador", {
          replace: true,
        });
        return;
      }

      setError(
        "El usuario no tiene un rol válido para acceder al sistema."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión"
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Iniciar sesión
        </h1>

        <p className="auth-description">
          Ingresa con tu correo institucional de la UNMSM.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="correo"
            >
              Correo institucional
            </label>

            <input
              className="auth-input"
              id="correo"
              name="correo"
              type="email"
              placeholder="usuario@unmsm.edu.pe"
              autoComplete="email"
              value={correo}
              onChange={(event) =>
                setCorreo(event.target.value)
              }
              required
            />
          </div>

          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="contrasena"
            >
              Contraseña
            </label>

            <input
              className="auth-input"
              id="contrasena"
              name="contrasena"
              type="password"
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              value={contrasena}
              onChange={(event) =>
                setContrasena(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <p
              className="auth-message auth-message-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            className="auth-primary-button"
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>
        </form>

        <button
          className="auth-secondary-button"
          type="button"
          onClick={irARecuperarContrasena}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </section>
  );
};

export default LoginPage;