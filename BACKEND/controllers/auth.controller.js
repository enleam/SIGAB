const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { correo, contrasena } = req.body;

  const contexto = {
    direccionIp: req.ip,
    userAgent: req.get("user-agent") || null,
  };

  const resultado = await authService.login(
    correo,
    contrasena,
    contexto
  );

  return res.status(200).json({
    ok: true,
    message: "Inicio de sesión exitoso",
    data: resultado,
  });
});

const obtenerSesionActual = asyncHandler(async (req, res) => {
  return res.status(200).json({
    ok: true,
    data: {
      usuario: req.usuario,
    },
  });
});

module.exports = {
  login,
  obtenerSesionActual,
};