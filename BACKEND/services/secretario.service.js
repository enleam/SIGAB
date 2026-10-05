const secretarioModel = require("../models/secretario.model");
const usuarioModel = require("../models/usuario.model");

const formatearSecretario = (secretario) => ({
  usuarioId: secretario.usuario_id,
  nombres: secretario.nombres,
  apellidos: secretario.apellidos,
  correoInstitucional: secretario.correo_institucional,
  estado: secretario.estado,
  cargo: secretario.cargo,
});

const listarSecretarios = async (termino) => {
  const secretarios = termino
    ? await secretarioModel.buscar(termino)
    : await secretarioModel.listar();

  return secretarios.map(formatearSecretario);
};

const obtenerSecretario = async (usuarioId) => {
  const secretario = await secretarioModel.buscarPorUsuarioId(usuarioId);

  if (!secretario) {
    const error = new Error("No se encontró el secretario");
    error.statusCode = 404;
    throw error;
  }

  return formatearSecretario(secretario);
};

const registrarSecretario = async ({
  nombres,
  apellidos,
  correoInstitucional,
  cargo,
}) => {
  if (!nombres || !apellidos || !correoInstitucional) {
    const error = new Error(
      "Nombres, apellidos y correo institucional son obligatorios"
    );
    error.statusCode = 400;
    throw error;
  }

  const correo = correoInstitucional.trim().toLowerCase();

  if (!correo.endsWith("@unmsm.edu.pe")) {
    const error = new Error(
      "El correo debe pertenecer al dominio institucional @unmsm.edu.pe"
    );
    error.statusCode = 400;
    throw error;
  }

  const usuarioExistente = await usuarioModel.buscarPorCorreo(correo);

  if (usuarioExistente) {
    const error = new Error("El correo institucional ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  const usuarioId = await secretarioModel.crear({
    nombres: nombres.trim(),
    apellidos: apellidos.trim(),
    correoInstitucional: correo,
    cargo: cargo?.trim() || null,
  });

  return obtenerSecretario(usuarioId);
};

const actualizarSecretario = async (
  usuarioId,
  {
    nombres,
    apellidos,
    correoInstitucional,
    cargo,
  }
) => {
  const secretarioActual =
    await secretarioModel.buscarPorUsuarioId(usuarioId);

  if (!secretarioActual) {
    const error = new Error("No se encontró el secretario");
    error.statusCode = 404;
    throw error;
  }

  if (!nombres || !apellidos || !correoInstitucional) {
    const error = new Error(
      "Nombres, apellidos y correo institucional son obligatorios"
    );
    error.statusCode = 400;
    throw error;
  }

  const correo = correoInstitucional.trim().toLowerCase();

  if (!correo.endsWith("@unmsm.edu.pe")) {
    const error = new Error(
      "El correo debe pertenecer al dominio institucional @unmsm.edu.pe"
    );
    error.statusCode = 400;
    throw error;
  }

  const usuarioConCorreo = await usuarioModel.buscarPorCorreo(correo);

  if (
    usuarioConCorreo &&
    Number(usuarioConCorreo.id) !== Number(usuarioId)
  ) {
    const error = new Error("El correo institucional ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  await secretarioModel.actualizar(usuarioId, {
    nombres: nombres.trim(),
    apellidos: apellidos.trim(),
    correoInstitucional: correo,
    cargo: cargo?.trim() || null,
  });

  return obtenerSecretario(usuarioId);
};

const desactivarSecretario = async (usuarioId) => {
  const secretario = await secretarioModel.buscarPorUsuarioId(usuarioId);

  if (!secretario) {
    const error = new Error("No se encontró el secretario");
    error.statusCode = 404;
    throw error;
  }

  if (secretario.estado === "INACTIVO") {
    const error = new Error("El secretario ya se encuentra inactivo");
    error.statusCode = 400;
    throw error;
  }

  await secretarioModel.desactivar(usuarioId);

  return obtenerSecretario(usuarioId);
};

module.exports = {
  listarSecretarios,
  obtenerSecretario,
  registrarSecretario,
  actualizarSecretario,
  desactivarSecretario,
};
