import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import "../styles/home.css";

const HomePage = () => {
  const navigate = useNavigate();

  const {
    usuario,
    estaAutenticado,
  } = useAuth();

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
    <section className="home-hero">
      <div className="home-content">
        <h1 className="home-title">
          SIGAB
        </h1>

        <h2 className="home-subtitle">
          Sistema Integrado de Gestión y Asignación de Bolsistas
        </h2>

        <p className="home-description">
          Plataforma para la gestión de convocatorias,
          postulaciones y asignación de bolsistas de la
          Universidad Nacional Mayor de San Marcos.
        </p>

        <div className="home-actions">
          <button
            type="button"
            className="home-primary-button"
            onClick={irAlAcceso}
          >
            {estaAutenticado
              ? "Ir a mi panel"
              : "Iniciar sesión"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;