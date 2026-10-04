const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    ok: false,
    message:
      "Se realizaron demasiados intentos de inicio de sesión. Intente nuevamente más tarde.",
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    ok: false,
    message:
      "Se realizaron demasiadas solicitudes. Intente nuevamente más tarde.",
  },
});

module.exports = {
  loginLimiter,
  passwordResetLimiter,
};