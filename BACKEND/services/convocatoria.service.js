
const convocatoriaModel = require("../models/convocatoria.model");
const estudianteService = require("./estudiante.service");

// HU04 - Consultar convocatorias según los
// requisitos académicos del estudiante.
const listarElegibles = async (usuarioId) => {
  // Obtener perfil mediante el servicio existente.
  const perfil = await estudianteService.obtenerPerfil(usuarioId);

  // Consultar las convocatorias que coincidan
  // con los criterios académicos estructurados.
  const convocatorias =
    await convocatoriaModel.listarElegiblesPorEstudiante(
      usuarioId
    );

  // Preparar las convocatorias para el frontend.
  const convocatoriasFormateadas = convocatorias.map(
    (convocatoria) => ({
      id: convocatoria.id,
      titulo: convocatoria.titulo,
      descripcion: convocatoria.descripcion,
      funciones: convocatoria.funciones,
      requisitos: convocatoria.requisitos,
      vacantes: convocatoria.vacantes,
      horario: convocatoria.horario,
      tipoTrabajo: convocatoria.tipo_trabajo,
      remuneracion: convocatoria.remuneracion,
      fechaInicio: convocatoria.fecha_inicio,
      fechaLimite: convocatoria.fecha_limite,
      alcance: convocatoria.alcance,
      estado: convocatoria.estado,
      periodoId: convocatoria.periodo_id,
      dependencia: {
        id: convocatoria.dependencia_id,
        nombre: convocatoria.dependencia,
      },
      publicadaEn: convocatoria.publicada_en,
    })
  );

  return {
    perfil: {
      perfilCompleto: perfil.perfilCompleto,
      camposFaltantes: perfil.camposFaltantes,
    },

    postulacionHabilitadaPorPerfil: perfil.perfilCompleto,

    total: convocatoriasFormateadas.length,

    convocatorias: convocatoriasFormateadas,

    mensaje: perfil.perfilCompleto
      ? "Se muestran convocatorias que coinciden con los criterios académicos estructurados. Revisa sus demás requisitos antes de postular."
      : "Tu perfil está incompleto. Puedes consultar las convocatorias, pero debes completar tus datos obligatorios antes de postular.",
  };
};

module.exports = {
  listarElegibles,
};
