const manejarError = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error("Error interno:", {
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.warn("Error controlado:", {
      statusCode,
      message: error.message,
    });
  }

  return res.status(statusCode).json({
    ok: false,
    message:
      statusCode >= 500
        ? "Error interno del servidor"
        : error.message,
  });
};

module.exports = {
  manejarError,
};