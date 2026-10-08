
const express = require("express");

const authRoutes = require("./auth.routes");
const estudianteRoutes = require("./estudiante.routes");
const secretarioRoutes = require("./secretario.routes");
const passwordResetRoutes = require("./passwordReset.routes");
const postulacionRoutes = require("./postulacion.routes");

// HU04 - Convocatorias elegibles
const convocatoriaRoutes = require("./convocatoria.routes");

const router = express.Router();

/* ============================================================
   HEALTH CHECK
   ============================================================ */

router.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "API de SIGAB funcionando correctamente",
  });
});

/* ============================================================
   AUTENTICACION
   ============================================================ */

router.use(
  "/auth",
  authRoutes
);

/* ============================================================
   ESTUDIANTES
   ============================================================ */

router.use(
  "/estudiantes",
  estudianteRoutes
);

/* ============================================================
   SECRETARIOS
   ============================================================ */

router.use(
  "/secretarios",
  secretarioRoutes
);

/* ============================================================
   RECUPERACION DE CONTRASENA
   ============================================================ */

router.use(
  "/password-reset",
  passwordResetRoutes
);

/* ============================================================
   POSTULACIONES / EVALUACION - HU03
   ============================================================ */

router.use(
  "/postulaciones",
  postulacionRoutes
);

/* ============================================================
   CONVOCATORIAS ELEGIBLES - HU04
   ============================================================ */

router.use(
  "/convocatorias",
  convocatoriaRoutes
);

module.exports = router;
