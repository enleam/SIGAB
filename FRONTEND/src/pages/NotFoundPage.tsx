import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const {
    usuario,
    estaAutenticado,
  } = useAuth();

  const volverAlInicio = () => {
    if (!estaAutenticado || !usuario) {
      navigate("/");
      return;
    }

    if (usuario.rol === "ESTUDIANTE") {
      navigate("/estudiante");
      return;
    }

    if (usuario.rol === "SECRETARIO") {
      navigate("/secretario");
      return;
    }

    if (usuario.rol === "ADMINISTRADOR") {
      navigate("/administrador");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Página no encontrada
        </h1>

        <p className="auth-description">
          La página que intentas visitar no existe o no está disponible.
        </p>

        <button
          type="button"
          className="auth-primary-button"
          onClick={volverAlInicio}
        >
          {estaAutenticado
            ? "Volver a mi panel"
            : "Volver al inicio"}
        </button>
      </div>
    </section>
  );
};

export default NotFoundPage;