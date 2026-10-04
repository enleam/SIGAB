import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import "../styles/public.css";

const PublicLayout = () => {
  const navigate = useNavigate();

  const {
    usuario,
    estaAutenticado,
  } = useAuth();

  const irAlInicio = () => {
    navigate("/");
  };

  const irAlAcceso = () => {
    if (!estaAutenticado || !usuario) {
      navigate("/login");
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
    <div className="public-layout">
      <header className="public-header">
        <button
          type="button"
          className="public-brand"
          onClick={irAlInicio}
        >
          SIGAB
        </button>

        <nav className="public-nav">
          <button
            type="button"
            className="public-login-button"
            onClick={irAlAcceso}
          >
            {estaAutenticado
              ? "Ir a mi panel"
              : "Iniciar sesión"}
          </button>
        </nav>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <p>
          Sistema Integrado de Gestión y Asignación de Bolsistas
        </p>

        <p>
          Universidad Nacional Mayor de San Marcos
        </p>
      </footer>
    </div>
  );
};

export default PublicLayout;