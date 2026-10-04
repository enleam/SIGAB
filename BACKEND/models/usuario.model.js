const { sql, getConnection } = require("../config/db");

const buscarPorCorreo = async (correo) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("correo", sql.VarChar(180), correo)
    .query(`
      SELECT
        id,
        correo_institucional,
        contrasena_hash,
        rol,
        estado,
        correo_verificado,
        ultimo_acceso_en,
        creado_en,
        actualizado_en
      FROM seguridad.Usuario
      WHERE LOWER(correo_institucional) = LOWER(@correo)
    `);

  return result.recordset[0] || null;
};

const buscarPorId = async (usuarioId) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .query(`
      SELECT
        id,
        correo_institucional,
        rol,
        estado,
        correo_verificado,
        ultimo_acceso_en,
        creado_en,
        actualizado_en
      FROM seguridad.Usuario
      WHERE id = @usuarioId
    `);

  return result.recordset[0] || null;
};

const actualizarUltimoAcceso = async (usuarioId) => {
  const pool = await getConnection();

  await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .query(`
      UPDATE seguridad.Usuario
      SET ultimo_acceso_en = SYSDATETIME(),
          actualizado_en = SYSDATETIME()
      WHERE id = @usuarioId
    `);
};

const actualizarContrasena = async (usuarioId, contrasenaHash) => {
  const pool = await getConnection();

  await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .input("contrasenaHash", sql.VarChar(255), contrasenaHash)
    .query(`
      UPDATE seguridad.Usuario
      SET contrasena_hash = @contrasenaHash,
          actualizado_en = SYSDATETIME()
      WHERE id = @usuarioId
    `);
};

module.exports = {
  buscarPorCorreo,
  buscarPorId,
  actualizarUltimoAcceso,
  actualizarContrasena,
};