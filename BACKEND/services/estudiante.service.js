
const estudianteModel = require("../models/estudiante.model");

// HU04 - Verificar datos obligatorios del perfil
const verificarPerfilCompleto = (estudiante) => {
  const camposFaltantes = [];

  if (!estudiante.codigo_estudiante?.trim()) {
    camposFaltantes.push("codigoEstudiante");
  }

  if (!estudiante.nombres?.trim()) {
    camposFaltantes.push("nombres");
  }

  if (!estudiante.apellidos?.trim()) {
    camposFaltantes.push("apellidos");
  }

  if (estudiante.facultad_id == null) {
    camposFaltantes.push("facultad");
  }

  if (estudiante.carrera_id == null) {
    camposFaltantes.push("carrera");
  }

  if (estudiante.ciclo == null) {
    camposFaltantes.push("ciclo");
  }

  if (!estudiante.telefono?.trim()) {
    camposFaltantes.push("telefono");
  }

  return {
    perfilCompleto: camposFaltantes.length === 0,
    camposFaltantes,
  };
};

// HU01 - Consultar perfil del estudiante
// HU04 - Incluir estado de completitud
const obtenerPerfil = async (usuarioId) => {
  const estudiante = await estudianteModel.buscarPorUsuarioId(
    usuarioId
  );

  if (!estudiante) {
    const error = new Error(
      "No se encontró el perfil del estudiante"
    );
    error.statusCode = 404;
    throw error;
  }

  const validacion = verificarPerfilCompleto(estudiante);

  return {
    usuarioId: estudiante.usuario_id,
    codigoEstudiante: estudiante.codigo_estudiante,
    nombres: estudiante.nombres,
    apellidos: estudiante.apellidos,
    facultad: {
      id: estudiante.facultad_id,
      nombre: estudiante.facultad,
    },
    carrera: {
      id: estudiante.carrera_id,
      nombre: estudiante.carrera,
    },
    ciclo: estudiante.ciclo,
    telefono: estudiante.telefono,
    perfilCompleto: validacion.perfilCompleto,
    camposFaltantes: validacion.camposFaltantes,
  };
};

module.exports = {
  obtenerPerfil,
  verificarPerfilCompleto,
};
