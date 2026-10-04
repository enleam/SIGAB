const estudianteService = require("../services/estudiante.service");
const asyncHandler = require("../utils/asyncHandler");

const obtenerPerfil = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id;

  const estudiante = await estudianteService.obtenerPerfil(usuarioId);

  return res.status(200).json({
    ok: true,
    data: estudiante,
  });
});

module.exports = {
  obtenerPerfil,
};