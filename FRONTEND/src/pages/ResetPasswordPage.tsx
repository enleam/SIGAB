import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { passwordResetService } from "../services/passwordReset.service";

import "../styles/auth.css";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [nuevaContrasena, setNuevaContrasena] =
    useState("");

  const [confirmarContrasena, setConfirmarContrasena] =
    useState("");

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const volverAlLogin = () => {
    navigate("/login", {
      replace: true,
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!token) {
      setError(
        "El enlace de recuperación no contiene un token válido."
      );
      return;
    }

    if (nuevaContrasena.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      const respuesta =
        await passwordResetService.restablecerContrasena(
          token,
          nuevaContrasena
        );

      setMensaje(respuesta.message);

      setNuevaContrasena("");
      setConfirmarContrasena("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo restablecer la contraseña"
      );
    } finally {
      setCargando(false);
    }
  };

  if (!token) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">
            Restablecer contraseña
          </h1>

          <p
            className="auth-message auth-message-error"
            role="alert"
          >
            El enlace de recuperación no contiene un token válido.
          </p>

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
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Restablecer contraseña
        </h1>

        <p className="auth-description">
          Ingresa una nueva contraseña para tu cuenta.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="nuevaContrasena"
            >
              Nueva contraseña
            </label>

            <input
              className="auth-input"
              id="nuevaContrasena"
              name="nuevaContrasena"
              type="password"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              value={nuevaContrasena}
              onChange={(event) =>
                setNuevaContrasena(event.target.value)
              }
              minLength={8}
              required
            />
          </div>

          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="confirmarContrasena"
            >
              Confirmar contraseña
            </label>

            <input
              className="auth-input"
              id="confirmarContrasena"
              name="confirmarContrasena"
              type="password"
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
              value={confirmarContrasena}
              onChange={(event) =>
                setConfirmarContrasena(
                  event.target.value
                )
              }
              minLength={8}
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
              ? "Restableciendo..."
              : "Restablecer contraseña"}
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

export default ResetPasswordPage;