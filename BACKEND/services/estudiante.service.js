const estudianteModel = require("../models/estudiante.model");

const obtenerPerfil = async (usuarioId) => {
  const estudiante = await estudianteModel.buscarPorUsuarioId(usuarioId);

  if (!estudiante) {
    const error = new Error("No se encontró el perfil del estudiante");
    error.statusCode = 404;
    throw error;
  }

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
  };
};

module.exports = {
  obtenerPerfil,
};