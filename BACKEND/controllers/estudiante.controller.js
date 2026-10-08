
const estudianteService = require("../services/estudiante.service");
const asyncHandler = require("../utils/asyncHandler");

// HU01 - Consultar perfil del estudiante
// HU04 - Consultar estado de completitud del perfil
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
