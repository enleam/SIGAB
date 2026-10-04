const express = require("express");

const passwordResetController = require(
  "../controllers/passwordReset.controller"
);

const {
  validarSolicitudRestablecimiento,
  validarRestablecimiento,
} = require("../middlewares/validation.middleware");

const {
  passwordResetLimiter,
} = require("../middlewares/rateLimit.middleware");

const router = express.Router();

router.post(
  "/solicitar",
  passwordResetLimiter,
  validarSolicitudRestablecimiento,
  passwordResetController.solicitarRestablecimiento
);

router.post(
  "/restablecer",
  validarRestablecimiento,
  passwordResetController.restablecerContrasena
);

module.exports = router;