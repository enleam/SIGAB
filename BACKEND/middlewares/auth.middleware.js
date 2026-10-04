const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuario.model");

const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: "Token de autenticación requerido",
      });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        ok: false,
        message: "Formato de token inválido",
      });
    }

    const token = partes[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const usuario = await usuarioModel.buscarPorId(payload.id);

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no válido",
      });
    }

    if (usuario.estado !== "ACTIVO") {
      return res.status(403).json({
        ok: false,
        message: "La cuenta no se encuentra activa",
      });
    }

    req.usuario = {
      id: usuario.id,
      correo: usuario.correo_institucional,
      rol: usuario.rol,
    };

    // Renovamos el JWT porque hubo actividad válida.
    const nuevoToken = jwt.sign(
      {
        id: usuario.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    res.setHeader("X-Access-Token", nuevoToken);

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        message: "La sesión ha expirado por inactividad",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        ok: false,
        message: "Token inválido",
      });
    }

    next(error);
  }
};

module.exports = {
  verificarToken,
};