import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
  const navigate = useNavigate();

  const irAlPerfil = () => {
    navigate("/estudiante/perfil");
  };

  return (
    <section className="private-page">
      <h1 className="private-page-title">
        Panel del estudiante
      </h1>

      <p className="private-page-description">
        Desde aquí podrás consultar convocatorias, revisar tu perfil
        y gestionar tus postulaciones.
      </p>

      <div className="private-actions">
        <button
          type="button"
          className="private-primary-button"
          onClick={irAlPerfil}
        >
          Mi perfil
        </button>
      </div>
    </section>
  );
};

export default StudentHomePage;