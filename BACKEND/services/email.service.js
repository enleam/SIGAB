const nodemailer = require("nodemailer");

const validarConfiguracionSMTP = () => {
  const variablesRequeridas = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "FRONTEND_URL",
  ];

  const faltantes = variablesRequeridas.filter(
    (variable) => !process.env[variable]
  );

  if (faltantes.length > 0) {
    const error = new Error(
      `Faltan variables de entorno SMTP: ${faltantes.join(", ")}`
    );
    error.statusCode = 500;
    throw error;
  }
};

const crearTransporter = () => {
  validarConfiguracionSMTP();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const enviarCorreoRestablecimiento = async (correo, token) => {
  const transporter = crearTransporter();

  const enlaceRestablecimiento =
    `${process.env.FRONTEND_URL}/restablecer-contrasena?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: `"SIGAB" <${process.env.SMTP_USER}>`,
    to: correo,
    subject: "Restablecimiento de contraseña - SIGAB",
    text: `
Se solicitó el restablecimiento de tu contraseña de SIGAB.

Puedes establecer una nueva contraseña ingresando al siguiente enlace:

${enlaceRestablecimiento}

El enlace tendrá una vigencia de 15 minutos.

Si no solicitaste este cambio, puedes ignorar este mensaje.
    `,
  });
};

module.exports = {
  enviarCorreoRestablecimiento,
};