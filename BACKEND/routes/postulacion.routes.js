const express = require("express");

const postulacionController = require(
  "../controllers/postulacion.controller"
);

const {
  verificarToken,
} = require("../middlewares/auth.middleware");

const {
  permitirRoles,
} = require("../middlewares/role.middleware");

const router = express.Router();

router.get(
  "/convocatoria/:convocatoriaId/evaluacion",
  verificarToken,
  permitirRoles("SECRETARIO"),
  postulacionController.listarParaEvaluacion
);

module.exports = router;