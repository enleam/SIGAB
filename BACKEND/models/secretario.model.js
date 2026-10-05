const { sql, getConnection } = require("../config/db");

const listar = async () => {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT
      s.usuario_id,
      s.nombres,
      s.apellidos,
      u.correo_institucional,
      u.estado,
      s.cargo,
      s.creado_en,
      s.actualizado_en
    FROM personas.Secretario s
    INNER JOIN seguridad.Usuario u
      ON u.id = s.usuario_id
    WHERE u.rol = 'SECRETARIO'
    ORDER BY s.apellidos, s.nombres
  `);

  return result.recordset;
};

const buscarPorUsuarioId = async (usuarioId) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .query(`
      SELECT
        s.usuario_id,
        s.nombres,
        s.apellidos,
        u.correo_institucional,
        u.estado,
        s.cargo,
        s.creado_en,
        s.actualizado_en
      FROM personas.Secretario s
      INNER JOIN seguridad.Usuario u
        ON u.id = s.usuario_id
      WHERE s.usuario_id = @usuarioId
        AND u.rol = 'SECRETARIO'
    `);

  return result.recordset[0] || null;
};

const buscar = async (termino) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("termino", sql.NVarChar(180), `%${termino}%`)
    .query(`
      SELECT
        s.usuario_id,
        s.nombres,
        s.apellidos,
        u.correo_institucional,
        u.estado,
        s.cargo,
        s.creado_en,
        s.actualizado_en
      FROM personas.Secretario s
      INNER JOIN seguridad.Usuario u
        ON u.id = s.usuario_id
      WHERE u.rol = 'SECRETARIO'
        AND (
          s.nombres LIKE @termino
          OR s.apellidos LIKE @termino
          OR CONCAT(s.nombres, ' ', s.apellidos) LIKE @termino
        )
      ORDER BY s.apellidos, s.nombres
    `);

  return result.recordset;
};

const crear = async ({
  nombres,
  apellidos,
  correoInstitucional,
  cargo,
}) => {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const usuarioResult = await new sql.Request(transaction)
      .input(
        "correoInstitucional",
        sql.VarChar(180),
        correoInstitucional
      )
      .query(`
        INSERT INTO seguridad.Usuario (
          correo_institucional,
          rol,
          estado
        )
        OUTPUT INSERTED.id
        VALUES (
          @correoInstitucional,
          'SECRETARIO',
          'ACTIVO'
        )
      `);

    const usuarioId = usuarioResult.recordset[0].id;

    await new sql.Request(transaction)
      .input("usuarioId", sql.BigInt, usuarioId)
      .input("nombres", sql.NVarChar(120), nombres)
      .input("apellidos", sql.NVarChar(160), apellidos)
      .input("cargo", sql.NVarChar(120), cargo || null)
      .query(`
        INSERT INTO personas.Secretario (
          usuario_id,
          nombres,
          apellidos,
          cargo
        )
        VALUES (
          @usuarioId,
          @nombres,
          @apellidos,
          @cargo
        )
      `);

    await transaction.commit();

    return usuarioId;
  } catch (error) {
    if (transaction._aborted !== true) {
      await transaction.rollback();
    }

    throw error;
  }
};

const actualizar = async (
  usuarioId,
  {
    nombres,
    apellidos,
    correoInstitucional,
    cargo,
  }
) => {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    await new sql.Request(transaction)
      .input("usuarioId", sql.BigInt, usuarioId)
      .input(
        "correoInstitucional",
        sql.VarChar(180),
        correoInstitucional
      )
      .query(`
        UPDATE seguridad.Usuario
        SET
          correo_institucional = @correoInstitucional,
          actualizado_en = SYSDATETIME()
        WHERE id = @usuarioId
          AND rol = 'SECRETARIO'
      `);

    await new sql.Request(transaction)
      .input("usuarioId", sql.BigInt, usuarioId)
      .input("nombres", sql.NVarChar(120), nombres)
      .input("apellidos", sql.NVarChar(160), apellidos)
      .input("cargo", sql.NVarChar(120), cargo || null)
      .query(`
        UPDATE personas.Secretario
        SET
          nombres = @nombres,
          apellidos = @apellidos,
          cargo = @cargo,
          actualizado_en = SYSDATETIME()
        WHERE usuario_id = @usuarioId
      `);

    await transaction.commit();
  } catch (error) {
    if (transaction._aborted !== true) {
      await transaction.rollback();
    }

    throw error;
  }
};

const desactivar = async (usuarioId) => {
  const pool = await getConnection();

  await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .query(`
      UPDATE seguridad.Usuario
      SET
        estado = 'INACTIVO',
        actualizado_en = SYSDATETIME()
      WHERE id = @usuarioId
        AND rol = 'SECRETARIO'
    `);
};

module.exports = {
  listar,
  buscarPorUsuarioId,
  buscar,
  crear,
  actualizar,
  desactivar,
};
