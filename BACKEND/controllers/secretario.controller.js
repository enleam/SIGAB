const secretarioService = require("../services/secretario.service");
const asyncHandler = require("../utils/asyncHandler");

const listarSecretarios = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const secretarios = await secretarioService.listarSecretarios(q);

  return res.status(200).json({
    ok: true,
    data: secretarios,
  });
});

const obtenerSecretario = asyncHandler(async (req, res) => {
  const { usuarioId } = req.params;

  const secretario = await secretarioService.obtenerSecretario(usuarioId);

  return res.status(200).json({
    ok: true,
    data: secretario,
  });
});

const registrarSecretario = asyncHandler(async (req, res) => {
  const secretario = await secretarioService.registrarSecretario(req.body);

  return res.status(201).json({
    ok: true,
    message: "Secretario registrado correctamente",
    data: secretario,
  });
});

const actualizarSecretario = asyncHandler(async (req, res) => {
  const { usuarioId } = req.params;

  const secretario = await secretarioService.actualizarSecretario(
    usuarioId,
    req.body
  );

  return res.status(200).json({
    ok: true,
    message: "Secretario actualizado correctamente",
    data: secretario,
  });
});

const desactivarSecretario = asyncHandler(async (req, res) => {
  const { usuarioId } = req.params;

  const secretario =
    await secretarioService.desactivarSecretario(usuarioId);

  return res.status(200).json({
    ok: true,
    message: "Secretario desactivado correctamente",
    data: secretario,
  });
});

module.exports = {
  listarSecretarios,
  obtenerSecretario,
  registrarSecretario,
  actualizarSecretario,
  desactivarSecretario,
};
