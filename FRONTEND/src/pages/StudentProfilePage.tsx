
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { estudianteService } from "../services/estudiante.service";

import type { PerfilEstudiante } from "../types/estudiante";

const nombresCampos: Record<string, string> = {
  codigoEstudiante: "Código de estudiante",
  nombres: "Nombres",
  apellidos: "Apellidos",
  facultad: "Facultad",
  carrera: "Carrera",
  ciclo: "Ciclo",
  telefono: "Teléfono",
};

const StudentProfilePage = () => {
  const navigate = useNavigate();

  const [perfil, setPerfil] =
    useState<PerfilEstudiante | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      try {
        const datos =
          await estudianteService.obtenerPerfil();

        if (!activo) return;

        setPerfil(datos);
      } catch (error) {
        if (!activo) return;

        setError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el perfil"
        );
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarPerfil();

    return () => {
      activo = false;
    };
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

  if (error || !perfil) {
    return (
      <section className="private-page">
        <h1 className="private-page-title">
          Perfil del estudiante
        </h1>

        <p
          className={
            error
              ? "private-error-message"
              : "private-page-description"
          }
          role={error ? "alert" : undefined}
        >
          {error || "No se encontró información del estudiante."}
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
        Consulta tu información personal y académica
        registrada en SIGAB. Los datos provienen de
        la base de datos institucional y son de solo lectura.
      </p>

      {/* HU04 - Estado de completitud del perfil */}
      <div
        role="status"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "16px",
          marginBottom: "24px",
          borderRadius: "10px",
          border: `1px solid ${
            perfil.perfilCompleto
              ? "#86c9a3"
              : "#e7b66d"
          }`,
        }}
      >
        {perfil.perfilCompleto ? (
          <CheckCircle2
            size={22}
            color="#238653"
            aria-hidden="true"
          />
        ) : (
          <AlertCircle
            size={22}
            color="#c17c20"
            aria-hidden="true"
          />
        )}

        <div>
          <strong>
            {perfil.perfilCompleto
              ? "Perfil académico completo"
              : "Perfil académico incompleto"}
          </strong>

          <p style={{ margin: "6px 0 0" }}>
            {perfil.perfilCompleto
              ? "Tus datos obligatorios están registrados. La postulación dependerá también de los requisitos de cada convocatoria."
              : "Existen datos obligatorios incompletos en tu perfil. Deben regularizarse en la información institucional antes de poder postular."}
          </p>

          {!perfil.perfilCompleto &&
            perfil.camposFaltantes.length > 0 && (
              <p style={{ margin: "8px 0 0" }}>
                <strong>Campos pendientes: </strong>
                {perfil.camposFaltantes
                  .map(
                    (campo) =>
                      nombresCampos[campo] ?? campo
                  )
                  .join(", ")}
              </p>
            )}
        </div>
      </div>

      {/* HU01 / HU04 - Datos de solo lectura */}
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
          <ArrowLeft
            size={16}
            aria-hidden="true"
          />
          Volver al panel
        </button>
      </div>
    </section>
  );
};

export default StudentProfilePage;
