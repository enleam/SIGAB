const postulacionService = require(
  "../services/postulacion.service"
);

const auditoriaService = require(
  "../services/auditoria.service"
);

const asyncHandler = require("../utils/asyncHandler");

const listarParaEvaluacion = asyncHandler(
  async (req, res) => {
    const { convocatoriaId } = req.params;

    const resultado =
      await postulacionService.listarParaEvaluacion({
        convocatoriaId,
        secretarioId: req.usuario.id,
      });

    await auditoriaService.registrarAccesoEvaluacionAnonimizada({
      usuarioId: req.usuario.id,
      convocatoriaId,
      direccionIp: req.ip,
      userAgent: req.get("user-agent") || null,
    });

    return res.status(200).json({
      ok: true,
      data: resultado,
    });
  }
);

module.exports = {
  listarParaEvaluacion,
};