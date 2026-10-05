const express = require("express");

const secretarioController = require("../controllers/secretario.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { permitirRoles } = require("../middlewares/role.middleware");

const router = express.Router();

router.get(
  "/",
  verificarToken,
  permitirRoles("ADMINISTRADOR"),
  secretarioController.listarSecretarios
);

router.get(
  "/:usuarioId",
  verificarToken,
  permitirRoles("ADMINISTRADOR"),
  secretarioController.obtenerSecretario
);

router.post(
  "/",
  verificarToken,
  permitirRoles("ADMINISTRADOR"),
  secretarioController.registrarSecretario
);

router.put(
  "/:usuarioId",
  verificarToken,
  permitirRoles("ADMINISTRADOR"),
  secretarioController.actualizarSecretario
);

router.patch(
  "/:usuarioId/desactivar",
  verificarToken,
  permitirRoles("ADMINISTRADOR"),
  secretarioController.desactivarSecretario
);

module.exports = router;
