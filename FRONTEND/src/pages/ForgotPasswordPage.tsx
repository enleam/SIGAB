import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { passwordResetService } from "../services/passwordReset.service";

import "../styles/auth.css";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const volverAlLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const respuesta =
        await passwordResetService.solicitarRestablecimiento(
          correo
        );

      setMensaje(respuesta.message);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo procesar la solicitud"
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Recuperar contraseña
        </h1>

        <p className="auth-description">
          Ingresa tu correo institucional para recibir las
          instrucciones de restablecimiento.
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

          {mensaje && (
            <p
              className="auth-message auth-message-success"
              role="status"
            >
              {mensaje}
            </p>
          )}

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
              ? "Enviando..."
              : "Enviar instrucciones"}
          </button>
        </form>

        <button
          className="auth-secondary-button"
          type="button"
          onClick={volverAlLogin}
        >
          Volver al inicio de sesión
        </button>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;