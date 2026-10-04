const express = require("express");

const authController = require("../controllers/auth.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { validarLogin } = require("../middlewares/validation.middleware");
const { loginLimiter } = require("../middlewares/rateLimit.middleware");

const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  validarLogin,
  authController.login
);

router.get(
  "/me",
  verificarToken,
  authController.obtenerSesionActual
);

module.exports = router;