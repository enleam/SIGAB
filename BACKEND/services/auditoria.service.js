const auditoriaModel = require("../models/auditoria.model");

const ejecutarAuditoriaSegura = async (datosEvento) => {
  try {
    await auditoriaModel.registrarEvento(datosEvento);
  } catch (error) {
    console.error(
      "No se pudo registrar el evento de auditoría:",
      error.message
    );
  }
};

const registrarLoginExitoso = async ({
  usuarioId,
  rol,
  direccionIp,
  userAgent,
}) => {
  await ejecutarAuditoriaSegura({
    usuarioId,
    tipoEvento: "LOGIN_EXITOSO",
    entidadTipo: "USUARIO",
    entidadId: usuarioId,
    esAccesoSensible: true,
    detalle: {
      rol,
    },
    direccionIp,
    userAgent,
  });
};

const registrarLoginFallido = async ({
  usuarioId = null,
  motivo,
  direccionIp,
  userAgent,
}) => {
  await ejecutarAuditoriaSegura({
    usuarioId,
    tipoEvento: "LOGIN_FALLIDO",
    entidadTipo: "USUARIO",
    entidadId: usuarioId,
    esAccesoSensible: true,
    detalle: {
      motivo,
    },
    direccionIp,
    userAgent,
  });
};

const registrarRestablecimientoContrasena = async ({
  usuarioId,
  direccionIp,
  userAgent,
}) => {
  await ejecutarAuditoriaSegura({
    usuarioId,
    tipoEvento: "RESTABLECIMIENTO_CONTRASENA",
    entidadTipo: "USUARIO",
    entidadId: usuarioId,
    esAccesoSensible: true,
    detalle: {
      resultado: "EXITOSO",
    },
    direccionIp,
    userAgent,
  });
};

module.exports = {
  registrarLoginExitoso,
  registrarLoginFallido,
  registrarRestablecimientoContrasena,
};