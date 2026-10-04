const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const usuarioModel = require("../models/usuario.model");
const tokenModel = require("../models/tokenRestablecimiento.model");
const emailService = require("./email.service");
const auditoriaService = require("./auditoria.service");

const solicitarRestablecimiento = async (
  correo,
  contexto = {}
) => {
  const usuario = await usuarioModel.buscarPorCorreo(correo);

  // No revelamos si el correo existe o no.
  if (!usuario) {
    return;
  }

  await tokenModel.invalidarTokensActivos(usuario.id);

  const token = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const expiraEn = new Date(Date.now() + 15 * 60 * 1000);

  const tokenCreado = await tokenModel.crearToken(
    usuario.id,
    tokenHash,
    expiraEn
  );

  try {
    await emailService.enviarCorreoRestablecimiento(
      usuario.correo_institucional,
      token
    );
  } catch (error) {
    await tokenModel.invalidarTokenPorId(tokenCreado.id);

    const emailError = new Error(
      "No se pudo enviar el correo de recuperación"
    );
    emailError.statusCode = 500;
    throw emailError;
  }
};

const restablecerContrasena = async (
  token,
  nuevaContrasena,
  contexto = {}
) => {
  const {
    direccionIp = null,
    userAgent = null,
  } = contexto;

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const tokenRegistrado =
    await tokenModel.buscarTokenValido(tokenHash);

  if (!tokenRegistrado) {
    const error = new Error(
      "El token es inválido, ha expirado o ya fue utilizado"
    );
    error.statusCode = 400;
    throw error;
  }

  const contrasenaHash = await bcrypt.hash(
    nuevaContrasena,
    10
  );

  await tokenModel.restablecerContrasenaConToken(
    tokenRegistrado.id,
    tokenRegistrado.usuario_id,
    contrasenaHash
  );

  await auditoriaService.registrarRestablecimientoContrasena({
    usuarioId: tokenRegistrado.usuario_id,
    direccionIp,
    userAgent,
  });
};

module.exports = {
  solicitarRestablecimiento,
  restablecerContrasena,
};