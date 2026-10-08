
const express = require("express");

const authRoutes = require("./auth.routes");
const estudianteRoutes = require("./estudiante.routes");
const secretarioRoutes = require("./secretario.routes");
const passwordResetRoutes = require("./passwordReset.routes");
const postulacionRoutes = require("./postulacion.routes");

// HU04 - Convocatorias elegibles
const convocatoriaRoutes = require("./convocatoria.routes");

// HU05 - Gestión del CV
const cvRoutes = require("./cv.routes");

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
   AUTENTICACION - HU01
   ============================================================ */

router.use("/auth", authRoutes);

/* ============================================================
   ESTUDIANTES - HU01 / HU04
   ============================================================ */

router.use("/estudiantes", estudianteRoutes);

/* ============================================================
   GESTION DEL CV - HU05
   ============================================================ */

router.use("/estudiantes/cv", cvRoutes);

/* ============================================================
   SECRETARIOS - HU02
   ============================================================ */

router.use("/secretarios", secretarioRoutes);

/* ============================================================
   RECUPERACION DE CONTRASENA - HU01
   ============================================================ */

router.use("/password-reset", passwordResetRoutes);

/* ============================================================
   POSTULACIONES / EVALUACION - HU03
   ============================================================ */

router.use("/postulaciones", postulacionRoutes);

/* ============================================================
   CONVOCATORIAS ELEGIBLES - HU04
   ============================================================ */

router.use("/convocatorias", convocatoriaRoutes);

module.exports = router;
