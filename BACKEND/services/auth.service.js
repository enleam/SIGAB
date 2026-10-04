const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  buscarPorCorreo,
  actualizarUltimoAcceso,
} = require("../models/usuario.model");

const auditoriaService = require("./auditoria.service");

const login = async (correo, contrasena, contexto = {}) => {
  const {
    direccionIp = null,
    userAgent = null,
  } = contexto;

  const usuario = await buscarPorCorreo(correo);

  if (!usuario) {
    await auditoriaService.registrarLoginFallido({
      motivo: "CREDENCIALES_INVALIDAS",
      direccionIp,
      userAgent,
    });

    const error = new Error("Correo o contraseña incorrectos");
    error.statusCode = 401;
    throw error;
  }

  if (usuario.estado !== "ACTIVO") {
    await auditoriaService.registrarLoginFallido({
      usuarioId: usuario.id,
      motivo: `CUENTA_${usuario.estado}`,
      direccionIp,
      userAgent,
    });

    const error = new Error("La cuenta no se encuentra activa");
    error.statusCode = 403;
    throw error;
  }

  if (!usuario.contrasena_hash) {
    await auditoriaService.registrarLoginFallido({
      usuarioId: usuario.id,
      motivo: "CONTRASENA_NO_CONFIGURADA",
      direccionIp,
      userAgent,
    });

    const error = new Error(
      "El usuario no tiene una contraseña configurada"
    );
    error.statusCode = 401;
    throw error;
  }

  const contrasenaValida = await bcrypt.compare(
    contrasena,
    usuario.contrasena_hash
  );

  if (!contrasenaValida) {
    await auditoriaService.registrarLoginFallido({
      usuarioId: usuario.id,
      motivo: "CREDENCIALES_INVALIDAS",
      direccionIp,
      userAgent,
    });

    const error = new Error("Correo o contraseña incorrectos");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: usuario.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );

  await actualizarUltimoAcceso(usuario.id);

  await auditoriaService.registrarLoginExitoso({
    usuarioId: usuario.id,
    rol: usuario.rol,
    direccionIp,
    userAgent,
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      correo: usuario.correo_institucional,
      rol: usuario.rol,
    },
  };
};

module.exports = {
  login,
};