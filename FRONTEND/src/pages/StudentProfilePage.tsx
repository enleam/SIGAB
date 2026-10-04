import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { estudianteService } from "../services/estudiante.service";

import type { PerfilEstudiante } from "../types/estudiante";

const StudentProfilePage = () => {
  const navigate = useNavigate();

  const [perfil, setPerfil] =
    useState<PerfilEstudiante | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datos =
          await estudianteService.obtenerPerfil();

        setPerfil(datos);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el perfil"
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  const volverAlPanel = () => {
    navigate("/estudiante");
  };

  if (cargando) {
    return (
      <section className="private-page">
        <h1 className="private-page-title">
          Perfil del estudiante
        </h1>

        <p className="private-page-description">
          Cargando información del perfil...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="private-page">
        <h1 className="private-page-title">
          Perfil del estudiante
        </h1>

        <p
          className="private-error-message"
          role="alert"
        >
          {error}
        </p>

        <div className="private-actions">
          <button
            type="button"
            className="private-secondary-button"
            onClick={volverAlPanel}
          >
            Volver al panel
          </button>
        </div>
      </section>
    );
  }

  if (!perfil) {
    return (
      <section className="private-page">
        <h1 className="private-page-title">
          Perfil del estudiante
        </h1>

        <p className="private-page-description">
          No se encontró información del estudiante.
        </p>

        <div className="private-actions">
          <button
            type="button"
            className="private-secondary-button"
            onClick={volverAlPanel}
          >
            Volver al panel
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="private-page">
      <h1 className="private-page-title">
        Perfil del estudiante
      </h1>

      <p className="private-page-description">
        Información académica registrada en SIGAB.
      </p>

      <div className="student-profile-grid">
        <div className="student-profile-field">
          <span className="student-profile-label">
            Código de estudiante
          </span>

          <span className="student-profile-value">
            {perfil.codigoEstudiante}
          </span>
        </div>

        <div className="student-profile-field">
          <span className="student-profile-label">
            Nombres
          </span>

          <span className="student-profile-value">
            {perfil.nombres}
          </span>
        </div>

        <div className="student-profile-field">
          <span className="student-profile-label">
            Apellidos
          </span>

          <span className="student-profile-value">
            {perfil.apellidos}
          </span>
        </div>

        <div className="student-profile-field">
          <span className="student-profile-label">
            Facultad
          </span>

          <span className="student-profile-value">
            {perfil.facultad.nombre}
          </span>
        </div>

        <div className="student-profile-field">
          <span className="student-profile-label">
            Carrera
          </span>

          <span className="student-profile-value">
            {perfil.carrera.nombre}
          </span>
        </div>

        <div className="student-profile-field">
          <span className="student-profile-label">
            Ciclo
          </span>

          <span className="student-profile-value">
            {perfil.ciclo}
          </span>
        </div>

        <div className="student-profile-field">
          <span className="student-profile-label">
            Teléfono
          </span>

          <span className="student-profile-value">
            {perfil.telefono || "No registrado"}
          </span>
        </div>
      </div>

      <div className="private-actions">
        <button
          type="button"
          className="private-secondary-button"
          onClick={volverAlPanel}
        >
          Volver al panel
        </button>
      </div>
    </section>
  );
};

export default StudentProfilePage;