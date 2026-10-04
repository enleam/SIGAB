require("dotenv").config();

const {
  enviarCorreoRestablecimiento,
} = require("../services/email.service");

const probarCorreo = async () => {
  try {
    const correoDestino = "polishcow717@gmail.com";

    const tokenPrueba = "token-prueba-sigab";

    await enviarCorreoRestablecimiento(
      correoDestino,
      tokenPrueba
    );

    console.log("Correo de prueba enviado correctamente");

    process.exit(0);
  } catch (error) {
    console.error(
      "No se pudo enviar el correo de prueba:",
      error.message
    );

    process.exit(1);
  }
};

probarCorreo();