const rutaNoEncontrada = (req, res) => {
  return res.status(404).json({
    ok: false,
    message: "Ruta no encontrada",
  });
};

module.exports = {
  rutaNoEncontrada,
};