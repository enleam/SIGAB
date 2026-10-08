
const express = require("express");

const cvController = require("../controllers/cv.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { permitirRoles } = require("../middlewares/role.middleware");
const { cargarCV } = require("../middlewares/cvUpload.middleware");

const router = express.Router();

// Todas las operaciones del CV requieren un estudiante autenticado.
router.use(verificarToken);
router.use(permitirRoles("ESTUDIANTE"));

// Consultar información del CV vigente.
router.get("/", cvController.obtenerCV);

// Subir el primer CV o reemplazar el vigente.
router.post("/", cargarCV, cvController.subirCV);

// Visualizar el CV vigente en formato PDF.
router.get("/visualizar", cvController.visualizarCV);

// Descargar el CV vigente.
router.get("/descargar", cvController.descargarCV);

module.exports = router;
