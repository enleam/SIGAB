
const express = require("express");

const estudianteController = require("../controllers/estudiante.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { permitirRoles } = require("../middlewares/role.middleware");

const router = express.Router();

// HU01 - Consultar perfil del estudiante
// HU04 - Consultar estado de completitud del perfil
router.get(
  "/perfil",
  verificarToken,
  permitirRoles("ESTUDIANTE"),
  estudianteController.obtenerPerfil
);

module.exports = router;
