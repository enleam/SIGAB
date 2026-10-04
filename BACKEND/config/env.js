const variablesRequeridas = [
  "DB_USER",
  "DB_PASSWORD",
  "DB_SERVER",
  "DB_DATABASE",
  "JWT_SECRET",
  "FRONTEND_URL",
];

const validarPuerto = (nombreVariable, valor) => {
  if (!valor) {
    return;
  }

  const puerto = Number(valor);

  if (
    !Number.isInteger(puerto) ||
    puerto < 1 ||
    puerto > 65535
  ) {
    throw new Error(
      `${nombreVariable} debe ser un puerto válido`
    );
  }
};

const validarVariablesEntorno = () => {
  const faltantes = variablesRequeridas.filter(
    (variable) => !process.env[variable]
  );

  if (faltantes.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${faltantes.join(", ")}`
    );
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error(
      "JWT_SECRET debe tener al menos 32 caracteres"
    );
  }

  validarPuerto("DB_PORT", process.env.DB_PORT);
  validarPuerto("PORT", process.env.PORT);

  try {
    new URL(process.env.FRONTEND_URL);
  } catch {
    throw new Error(
      "FRONTEND_URL debe contener una URL válida"
    );
  }
};

module.exports = {
  validarVariablesEntorno,
};