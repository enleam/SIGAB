
const convocatoriaService = require("../services/convocatoria.service");
const asyncHandler = require("../utils/asyncHandler");

// HU04 - Listar convocatorias según los
// requisitos académicos del estudiante.
const listarElegibles = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id;

  const resultado = await convocatoriaService.listarElegibles(
    usuarioId
  );

  return res.status(200).json({
    ok: true,
    data: resultado,
  });
});

module.exports = {
  listarElegibles,
};
