const passwordResetService = require("../services/passwordReset.service");
const asyncHandler = require("../utils/asyncHandler");

const solicitarRestablecimiento = asyncHandler(async (req, res) => {
  const { correo } = req.body;

  const contexto = {
    direccionIp: req.ip,
    userAgent: req.get("user-agent") || null,
  };

  await passwordResetService.solicitarRestablecimiento(
    correo,
    contexto
  );

  return res.status(200).json({
    ok: true,
    message:
      "Si el correo está registrado, se enviarán instrucciones para restablecer la contraseña",
  });
});

const restablecerContrasena = asyncHandler(async (req, res) => {
  const { token, nuevaContrasena } = req.body;

  const contexto = {
    direccionIp: req.ip,
    userAgent: req.get("user-agent") || null,
  };

  await passwordResetService.restablecerContrasena(
    token,
    nuevaContrasena,
    contexto
  );

  return res.status(200).json({
    ok: true,
    message: "Contraseña restablecida correctamente",
  });
});

module.exports = {
  solicitarRestablecimiento,
  restablecerContrasena,
};