import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import { postulacionService } from "../services/postulacion.service";

import type {
  EvaluacionConvocatoria,
} from "../types/postulacion";

const SecretaryEvaluationPage = () => {
  const { convocatoriaId } = useParams();

  const [
    evaluacion,
    setEvaluacion,
  ] = useState<EvaluacionConvocatoria | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEvaluacion = async () => {
      if (!convocatoriaId) {
        setError(
          "No se recibió el identificador de la convocatoria"
        );
        setCargando(false);
        return;
      }

      const id = Number(convocatoriaId);

      if (!Number.isInteger(id) || id <= 0) {
        setError(
          "El identificador de la convocatoria no es válido"
        );
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);

        const resultado =
          await postulacionService.listarParaEvaluacion(id);

        setEvaluacion(resultado);
      } catch (error) {
        const mensaje =
          error instanceof Error
            ? error.message
            : "No se pudo cargar la evaluación";

        setError(mensaje);
        setEvaluacion(null);
      } finally {
        setCargando(false);
      }
    };

    cargarEvaluacion();
  }, [convocatoriaId]);

  if (cargando) {
    return (
      <section className="private-page">
        <h1 className="private-page-title">
          Evaluación de postulaciones
        </h1>

        <p className="private-page-description">
          Cargando postulaciones...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="private-page">
        <h1 className="private-page-title">
          Evaluación de postulaciones
        </h1>

        <p className="private-error-message">
          {error}
        </p>
      </section>
    );
  }

  if (!evaluacion) {
    return null;
  }

  return (
    <section className="private-page">
      <h1 className="private-page-title">
        Evaluación de postulaciones
      </h1>

      <p className="private-page-description">
        Convocatoria: {evaluacion.convocatoria.titulo}
      </p>

      <div className="evaluation-summary">
        <div className="evaluation-summary-item">
          <span className="evaluation-summary-label">
            Estado
          </span>

          <span className="evaluation-summary-value">
            {evaluacion.convocatoria.estado}
          </span>
        </div>

        <div className="evaluation-summary-item">
          <span className="evaluation-summary-label">
            Fecha límite
          </span>

          <span className="evaluation-summary-value">
            {new Date(
              evaluacion.convocatoria.fechaLimite
            ).toLocaleString()}
          </span>
        </div>
      </div>

      <h2 className="secretaries-section-title">
        Postulaciones anonimizadas
      </h2>

      {evaluacion.postulaciones.length === 0 ? (
        <p className="private-page-description">
          No existen postulaciones registradas para esta
          convocatoria.
        </p>
      ) : (
        <div className="evaluation-table-container">
          <table className="evaluation-table">
            <thead>
              <tr>
                <th>Código anónimo</th>
                <th>Estado</th>
                <th>Fecha de postulación</th>
                <th>Anonimización</th>
                <th>CV anonimizado</th>
              </tr>
            </thead>

            <tbody>
              {evaluacion.postulaciones.map(
                (postulacion) => (
                  <tr key={postulacion.codigoAnonimo}>
                    <td>
                      {postulacion.codigoAnonimo}
                    </td>

                    <td>
                      {postulacion.estado}
                    </td>

                    <td>
                      {new Date(
                        postulacion.fechaPostulacion
                      ).toLocaleString()}
                    </td>

                    <td>
                      {postulacion.estadoAnonimizacion}
                    </td>

                    <td>
                      {postulacion.cvAnonimizadoDisponible
                        ? "Disponible"
                        : "No disponible"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default SecretaryEvaluationPage;