const { sql, getConnection } = require("../config/db");

const crearToken = async (usuarioId, tokenHash, expiraEn) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .input("tokenHash", sql.Char(64), tokenHash)
    .input("expiraEn", sql.DateTime2, expiraEn)
    .query(`
      INSERT INTO seguridad.TokenRestablecimiento (
        usuario_id,
        token_hash,
        expira_en
      )
      OUTPUT
        INSERTED.id,
        INSERTED.usuario_id,
        INSERTED.expira_en,
        INSERTED.creado_en
      VALUES (
        @usuarioId,
        @tokenHash,
        @expiraEn
      )
    `);

  return result.recordset[0];
};

const buscarTokenValido = async (tokenHash) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("tokenHash", sql.Char(64), tokenHash)
    .query(`
      SELECT
        id,
        usuario_id,
        token_hash,
        expira_en,
        usado_en,
        creado_en
      FROM seguridad.TokenRestablecimiento
      WHERE token_hash = @tokenHash
        AND usado_en IS NULL
        AND expira_en > SYSDATETIME()
    `);

  return result.recordset[0] || null;
};

const restablecerContrasenaConToken = async (
  tokenId,
  usuarioId,
  contrasenaHash
) => {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const tokenResult = await new sql.Request(transaction)
      .input("tokenId", sql.BigInt, tokenId)
      .input("usuarioId", sql.BigInt, usuarioId)
      .query(`
        SELECT id
        FROM seguridad.TokenRestablecimiento WITH (UPDLOCK, ROWLOCK)
        WHERE id = @tokenId
          AND usuario_id = @usuarioId
          AND usado_en IS NULL
          AND expira_en > SYSDATETIME()
      `);

    if (tokenResult.recordset.length === 0) {
      const error = new Error(
        "El token es inválido, ha expirado o ya fue utilizado"
      );
      error.statusCode = 400;
      throw error;
    }

    await new sql.Request(transaction)
      .input("usuarioId", sql.BigInt, usuarioId)
      .input("contrasenaHash", sql.VarChar(255), contrasenaHash)
      .query(`
        UPDATE seguridad.Usuario
        SET contrasena_hash = @contrasenaHash,
            actualizado_en = SYSDATETIME()
        WHERE id = @usuarioId
      `);

    await new sql.Request(transaction)
      .input("tokenId", sql.BigInt, tokenId)
      .query(`
        UPDATE seguridad.TokenRestablecimiento
        SET usado_en = SYSDATETIME()
        WHERE id = @tokenId
      `);

    await transaction.commit();
  } catch (error) {
    if (transaction._aborted !== true) {
      try {
        await transaction.rollback();
      } catch {
        // La transacción ya puede encontrarse cerrada.
      }
    }

    throw error;
  }
};

const invalidarTokensActivos = async (usuarioId) => {
  const pool = await getConnection();

  await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .query(`
      UPDATE seguridad.TokenRestablecimiento
      SET usado_en = SYSDATETIME()
      WHERE usuario_id = @usuarioId
        AND usado_en IS NULL
        AND expira_en > SYSDATETIME()
    `);
};

const invalidarTokenPorId = async (tokenId) => {
  const pool = await getConnection();

  await pool
    .request()
    .input("tokenId", sql.BigInt, tokenId)
    .query(`
      UPDATE seguridad.TokenRestablecimiento
      SET usado_en = SYSDATETIME()
      WHERE id = @tokenId
        AND usado_en IS NULL
    `);
};

module.exports = {
  crearToken,
  buscarTokenValido,
  invalidarTokensActivos,
  invalidarTokenPorId,
  restablecerContrasenaConToken,
};