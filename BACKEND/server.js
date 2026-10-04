const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getConnection } = require("./config/db");
const { validarVariablesEntorno } = require("./config/env");

const authRoutes = require("./routes/auth.routes");
const estudianteRoutes = require("./routes/estudiante.routes");
const passwordResetRoutes = require("./routes/passwordReset.routes");

const { rutaNoEncontrada } = require("./middlewares/notFound.middleware");
const { manejarError } = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Validar configuración
validarVariablesEntorno();

// Configuración CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    exposedHeaders: ["X-Access-Token"],
  })
);

// Middlewares generales
app.use(express.json());

// Ruta para verificar que la API está activa
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "API de SIGAB funcionando correctamente",
  });
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/password-reset", passwordResetRoutes);

// Ruta no encontrada
app.use(rutaNoEncontrada);

// Middleware global de errores
app.use(manejarError);

// Inicio del servidor
const startServer = async () => {
  try {
    await getConnection();

    app.listen(PORT, () => {
      console.log(`Servidor SIGAB ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();