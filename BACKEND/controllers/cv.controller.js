
const path = require("node:path");
const cvService = require("../services/cv.service");
const asyncHandler = require("../utils/asyncHandler");

const obtenerCV = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id;

  const cv = await cvService.obtenerCVVigente(usuarioId);

  return res.status(200).json({
    ok: true,
    data: cv,
  });
});

const subirCV = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id;

  const cvAnterior = await cvService.obtenerCVVigente(usuarioId);

  const nuevoCV = await cvService.guardarCV(
    usuarioId,
    req.file
  );

  return res.status(cvAnterior ? 200 : 201).json({
    ok: true,
    mensaje: cvAnterior
      ? "CV actualizado correctamente."
      : "CV cargado correctamente.",
    data: {
      documentoId: nuevoCV.documento_id,
      archivoId: nuevoCV.archivo_id,
      nombreOriginal: nuevoCV.nombre_original,
      mimeType: nuevoCV.mime_type,
      tamanoBytes: nuevoCV.tamano_bytes,
      cargadoEn: nuevoCV.cargado_en,
      vigente: Boolean(nuevoCV.vigente),
    },
  });
});

const enviarArchivoCV = (descargar) =>
  asyncHandler(async (req, res) => {
    const usuarioId = req.usuario.id;

    const archivo = await cvService.obtenerArchivoCV(
      usuarioId
    );

    // Content-Disposition permite visualizar o descargar el PDF.
    // Express genera el nombre de forma segura para la cabecera.
    const nombreDescarga =
      path.basename(archivo.nombreOriginal) || "CV.pdf";

    res.type("pdf");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (descargar) {
      return res.download(
        archivo.rutaArchivo,
        nombreDescarga,
        (error) => {
          if (error && !res.headersSent) {
            res.status(error.statusCode || 500).json({
              ok: false,
              mensaje: "No se pudo descargar el CV.",
            });
          } else if (error) {
            res.destroy(error);
          }
        }
      );
    }

    res.setHeader(
      "Content-Disposition",
      'inline; filename="CV.pdf"'
    );

    return res.sendFile(archivo.rutaArchivo, (error) => {
      if (error && !res.headersSent) {
        res.status(error.statusCode || 500).json({
          ok: false,
          mensaje: "No se pudo visualizar el CV.",
        });
      } else if (error) {
        res.destroy(error);
      }
    });
  });

const visualizarCV = enviarArchivoCV(false);
const descargarCV = enviarArchivoCV(true);

module.exports = {
  obtenerCV,
  subirCV,
  visualizarCV,
  descargarCV,
};
