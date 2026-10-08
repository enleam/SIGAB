
const express = require("express");

const convocatoriaController = require(
  "../controllers/convocatoria.controller"
);

const {
  verificarToken,
} = require("../middlewares/auth.middleware");

const {
  permitirRoles,
} = require("../middlewares/role.middleware");

const router = express.Router();

// HU04 - Consultar convocatorias elegibles
// Acceso exclusivo para estudiantes autenticados
router.get(
  "/elegibles",
  verificarToken,
  permitirRoles("ESTUDIANTE"),
  convocatoriaController.listarElegibles
);

module.exports = router;
