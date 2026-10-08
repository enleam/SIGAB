
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const cvModel = require("../models/cv.model");

const TAMANO_MAXIMO = 5 * 1024 * 1024;

const DIRECTORIO_CV = path.resolve(
  __dirname,
  "..",
  "uploads",
  "cv"
);

const crearError = (mensaje, statusCode) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  return error;
};

const validarPDF = (archivo) => {
  if (!archivo || !Buffer.isBuffer(archivo.buffer)) {
    throw crearError("Debes seleccionar un archivo PDF.", 400);
  }

  if (
    archivo.buffer.length === 0 ||
    archivo.buffer.length > TAMANO_MAXIMO
  ) {
    throw crearError(
      "El CV debe tener un tamaño máximo de 5 MB y no estar vacío.",
      400
    );
  }

  if (!/\.pdf$/i.test(archivo.originalname || "")) {
    throw crearError(
      "El archivo debe tener extensión .pdf.",
      400
    );
  }

  if (archivo.mimetype !== "application/pdf") {
    throw crearError(
      "Solo se permiten archivos PDF.",
      400
    );
  }

  // Comprobar la firma inicial de un PDF.
  if (
    archivo.buffer.subarray(0, 5).toString("ascii") !== "%PDF-"
  ) {
    throw crearError(
      "El archivo no tiene una estructura PDF válida.",
      400
    );
  }
};

const obtenerCVVigente = async (usuarioId) => {
  const cv = await cvModel.buscarCVVigente(usuarioId);

  if (!cv) {
    return null;
  }

  return {
    documentoId: cv.documento_id,
    archivoId: cv.archivo_id,
    nombreOriginal: cv.nombre_original,
    mimeType: cv.mime_type,
    tamanoBytes: cv.tamano_bytes,
    cargadoEn: cv.cargado_en,
    vigente: Boolean(cv.vigente),
  };
};

const guardarCV = async (usuarioId, archivo) => {
  validarPDF(archivo);

  await fs.mkdir(DIRECTORIO_CV, {
    recursive: true,
  });

  const nombreAlmacenado = `${crypto.randomUUID()}.pdf`;

  const rutaAbsoluta = path.join(
    DIRECTORIO_CV,
    nombreAlmacenado
  );

  const rutaRelativa = path.join(
    "uploads",
    "cv",
    nombreAlmacenado
  );

  const hashSha256 = crypto
    .createHash("sha256")
    .update(archivo.buffer)
    .digest("hex");

  await fs.writeFile(
    rutaAbsoluta,
    archivo.buffer,
    { flag: "wx" }
  );

  try {
    return await cvModel.guardarCV(usuarioId, {
      nombreOriginal: path.basename(
        archivo.originalname
      ),
      nombreAlmacenado,
      rutaAlmacenamiento: rutaRelativa,
      mimeType: "application/pdf",
      tamanoBytes: archivo.buffer.length,
      hashSha256,
    });
  } catch (error) {
    // Si falla la transacción SQL, eliminar el archivo nuevo.
    await fs.unlink(rutaAbsoluta).catch(() => {});
    throw error;
  }
};

const obtenerArchivoCV = async (usuarioId) => {
  const cv = await cvModel.buscarCVVigente(usuarioId);

  if (!cv) {
    throw crearError(
      "No tienes un CV vigente registrado.",
      404
    );
  }

  const rutaArchivo = path.resolve(
    __dirname,
    "..",
    cv.ruta_almacenamiento
  );

  // La ruta almacenada debe pertenecer al directorio privado.
  if (
    path.dirname(rutaArchivo) !== DIRECTORIO_CV
  ) {
    throw crearError(
      "La ruta del CV no es válida.",
      500
    );
  }

  try {
    await fs.access(rutaArchivo);
  } catch {
    throw crearError(
      "El archivo del CV no está disponible.",
      404
    );
  }

  return {
    rutaArchivo,
    nombreOriginal: cv.nombre_original,
    mimeType: "application/pdf",
    tamanoBytes: cv.tamano_bytes,
  };
};

module.exports = {
  obtenerCVVigente,
  guardarCV,
  obtenerArchivoCV,
};
