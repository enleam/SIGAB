const correoInstitucionalRegex =
  /^[^\s@]+@unmsm\.edu\.pe$/i;

const validarLogin = (req, res, next) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({
      ok: false,
      message: "El correo y la contraseña son obligatorios",
    });
  }

  if (
    typeof correo !== "string" ||
    typeof contrasena !== "string"
  ) {
    return res.status(400).json({
      ok: false,
      message: "Formato de datos inválido",
    });
  }

  const correoNormalizado = correo.trim().toLowerCase();

  if (!correoInstitucionalRegex.test(correoNormalizado)) {
    return res.status(400).json({
      ok: false,
      message: "Debe utilizar un correo institucional de la UNMSM",
    });
  }

  req.body.correo = correoNormalizado;

  next();
};

const validarSolicitudRestablecimiento = (req, res, next) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({
      ok: false,
      message: "El correo es obligatorio",
    });
  }

  if (typeof correo !== "string") {
    return res.status(400).json({
      ok: false,
      message: "Formato de correo inválido",
    });
  }

  const correoNormalizado = correo.trim().toLowerCase();

  if (!correoInstitucionalRegex.test(correoNormalizado)) {
    return res.status(400).json({
      ok: false,
      message: "Debe utilizar un correo institucional de la UNMSM",
    });
  }

  req.body.correo = correoNormalizado;

  next();
};

const validarRestablecimiento = (req, res, next) => {
  const { token, nuevaContrasena } = req.body;

  if (!token || !nuevaContrasena) {
    return res.status(400).json({
      ok: false,
      message: "El token y la nueva contraseña son obligatorios",
    });
  }

  if (
    typeof token !== "string" ||
    typeof nuevaContrasena !== "string"
  ) {
    return res.status(400).json({
      ok: false,
      message: "Formato de datos inválido",
    });
  }

  if (nuevaContrasena.length < 8) {
    return res.status(400).json({
      ok: false,
      message: "La contraseña debe tener al menos 8 caracteres",
    });
  }

  next();
};

module.exports = {
  validarLogin,
  validarSolicitudRestablecimiento,
  validarRestablecimiento,
};