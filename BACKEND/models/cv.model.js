
const { sql, getConnection } = require("../config/db");

// Obtener el CV vigente de un estudiante.
const buscarCVVigente = async (estudianteId) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("estudianteId", sql.BigInt, estudianteId)
    .query(`
      SELECT TOP (1)
        de.id AS documento_id,
        de.estudiante_id,
        de.archivo_id,
        de.tipo,
        de.vigente,
        de.cargado_en,
        a.nombre_original,
        a.nombre_almacenado,
        a.ruta_almacenamiento,
        a.mime_type,
        a.tamano_bytes,
        a.hash_sha256
      FROM documentos.DocumentoEstudiante de
      INNER JOIN documentos.Archivo a
        ON a.id = de.archivo_id
      WHERE de.estudiante_id = @estudianteId
        AND de.tipo = 'CV'
        AND de.vigente = 1
      ORDER BY de.cargado_en DESC, de.id DESC
    `);

  return result.recordset[0] || null;
};

// Registrar o reemplazar el CV de un estudiante.
const guardarCV = async (estudianteId, archivo) => {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    // Bloquear el registro del estudiante durante el reemplazo.
    // Esto evita reemplazos simultáneos del mismo estudiante.
    const estudiante = await new sql.Request(transaction)
      .input("estudianteId", sql.BigInt, estudianteId)
      .query(`
        SELECT usuario_id
        FROM personas.Estudiante WITH (UPDLOCK, HOLDLOCK)
        WHERE usuario_id = @estudianteId
      `);

    if (estudiante.recordset.length === 0) {
      const error = new Error("El estudiante no existe.");
      error.statusCode = 404;
      throw error;
    }

    // Desactivar el CV vigente anterior, sin eliminarlo.
    await new sql.Request(transaction)
      .input("estudianteId", sql.BigInt, estudianteId)
      .query(`
        UPDATE documentos.DocumentoEstudiante
        SET
          vigente = 0,
          desactivado_en = SYSDATETIME()
        WHERE estudiante_id = @estudianteId
          AND tipo = 'CV'
          AND vigente = 1
      `);

    // Registrar los metadatos del nuevo archivo PDF.
    const archivoResult = await new sql.Request(transaction)
      .input(
        "nombreOriginal",
        sql.NVarChar(255),
        archivo.nombreOriginal
      )
      .input(
        "nombreAlmacenado",
        sql.NVarChar(255),
        archivo.nombreAlmacenado
      )
      .input(
        "rutaAlmacenamiento",
        sql.NVarChar(500),
        archivo.rutaAlmacenamiento
      )
      .input("mimeType", sql.VarChar(100), archivo.mimeType)
      .input("tamanoBytes", sql.BigInt, archivo.tamanoBytes)
      .input("hashSha256", sql.Char(64), archivo.hashSha256)
      .query(`
        INSERT INTO documentos.Archivo (
          nombre_original,
          nombre_almacenado,
          ruta_almacenamiento,
          mime_type,
          tamano_bytes,
          hash_sha256
        )
        OUTPUT INSERTED.id
        VALUES (
          @nombreOriginal,
          @nombreAlmacenado,
          @rutaAlmacenamiento,
          @mimeType,
          @tamanoBytes,
          @hashSha256
        )
      `);

    const archivoId = archivoResult.recordset[0].id;

    // Asociar el nuevo CV al estudiante.
    const documentoResult = await new sql.Request(transaction)
      .input("estudianteId", sql.BigInt, estudianteId)
      .input("archivoId", sql.BigInt, archivoId)
      .query(`
        INSERT INTO documentos.DocumentoEstudiante (
          estudiante_id,
          archivo_id,
          tipo,
          vigente
        )
        OUTPUT
          INSERTED.id AS documento_id,
          INSERTED.estudiante_id,
          INSERTED.archivo_id,
          INSERTED.tipo,
          INSERTED.vigente,
          INSERTED.cargado_en
        VALUES (
          @estudianteId,
          @archivoId,
          'CV',
          1
        )
      `);

    await transaction.commit();

    return {
      ...documentoResult.recordset[0],
      nombre_original: archivo.nombreOriginal,
      mime_type: archivo.mimeType,
      tamano_bytes: archivo.tamanoBytes,
    };
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      error.rollbackError = rollbackError;
    }

    throw error;
  }
};

module.exports = {
  buscarCVVigente,
  guardarCV,
};
