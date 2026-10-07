const postulacionModel = require("../models/postulacion.model");

const listarParaEvaluacion = async ({
  convocatoriaId,
  secretarioId,
}) => {
  if (!convocatoriaId) {
    const error = new Error(
      "El identificador de la convocatoria es obligatorio"
    );
    error.statusCode = 400;
    throw error;
  }

  const convocatoria =
    await postulacionModel.buscarConvocatoriaDelSecretario(
      convocatoriaId,
      secretarioId
    );

  if (!convocatoria) {
    const error = new Error(
      "La convocatoria no existe o no pertenece al secretario autenticado"
    );
    error.statusCode = 404;
    throw error;
  }

  if (convocatoria.estado !== "CERRADA") {
    const error = new Error(
      "Las postulaciones solo pueden consultarse para evaluación cuando la convocatoria está cerrada"
    );
    error.statusCode = 403;
    throw error;
  }

  const postulaciones =
    await postulacionModel.listarAnonimizadasPorConvocatoria(
      convocatoriaId
    );

  return {
    convocatoria: {
      id: convocatoria.id,
      titulo: convocatoria.titulo,
      estado: convocatoria.estado,
      fechaLimite: convocatoria.fecha_limite,
    },

    postulaciones: postulaciones.map((postulacion) => ({
      codigoAnonimo: postulacion.codigo_anonimo,
      estado: postulacion.estado,
      fechaPostulacion: postulacion.fecha_postulacion,
      estadoAnonimizacion:
        postulacion.estado_anonimizacion || "PENDIENTE",
      cvAnonimizadoDisponible:
        postulacion.estado_anonimizacion === "COMPLETADA" &&
        postulacion.archivo_anonimizado_id !== null,
      archivoAnonimizadoId:
        postulacion.estado_anonimizacion === "COMPLETADA"
          ? postulacion.archivo_anonimizado_id
          : null,
    })),
  };
};

module.exports = {
  listarParaEvaluacion,
};