
const multer = require("multer");

const TAMANO_MAXIMO_CV = 5 * 1024 * 1024;

const almacenamiento = multer.memoryStorage();

const filtroArchivo = (req, file, callback) => {
  const esPDF =
    file.mimetype === "application/pdf" &&
    /\.pdf$/i.test(file.originalname);

  if (!esPDF) {
    const error = new Error(
      "Solo se permiten archivos PDF."
    );

    error.statusCode = 400;

    return callback(error);
  }

  return callback(null, true);
};

const uploadCV = multer({
  storage: almacenamiento,
  limits: {
    fileSize: TAMANO_MAXIMO_CV,
    files: 1,
    fields: 0,
    parts: 1,
  },
  fileFilter: filtroArchivo,
}).single("cv");

const cargarCV = (req, res, next) => {
  uploadCV(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          error.statusCode = 413;
          error.message =
            "El CV no puede superar los 5 MB.";
        } else {
          error.statusCode = 400;
        }
      }

      return next(error);
    }

    return next();
  });
};

module.exports = {
  cargarCV,
};
