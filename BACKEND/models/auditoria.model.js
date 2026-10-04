const { sql, getConnection } = require("../config/db");

const limitarTexto = (valor, maximo) => {
  if (!valor) {
    return null;
  }

  return String(valor).slice(0, maximo);
};

const registrarEvento = async ({
  usuarioId = null,
  tipoEvento,
  entidadTipo,
  entidadId = null,
  esAccesoSensible = false,
  detalle = null,
  direccionIp = null,
  userAgent = null,
}) => {
  const pool = await getConnection();

  const detalleJson =
    detalle !== null
      ? JSON.stringify(detalle)
      : null;

  await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .input(
      "tipoEvento",
      sql.NVarChar(100),
      limitarTexto(tipoEvento, 100)
    )
    .input(
      "entidadTipo",
      sql.NVarChar(80),
      limitarTexto(entidadTipo, 80)
    )
    .input("entidadId", sql.BigInt, entidadId)
    .input("esAccesoSensible", sql.Bit, esAccesoSensible)
    .input(
      "detalle",
      sql.NVarChar(sql.MAX),
      detalleJson
    )
    .input(
      "direccionIp",
      sql.VarChar(45),
      limitarTexto(direccionIp, 45)
    )
    .input(
      "userAgent",
      sql.NVarChar(500),
      limitarTexto(userAgent, 500)
    )
    .query(`
      INSERT INTO seguridad.AuditoriaEvento (
        usuario_id,
        tipo_evento,
        entidad_tipo,
        entidad_id,
        es_acceso_sensible,
        detalle,
        direccion_ip,
        user_agent
      )
      VALUES (
        @usuarioId,
        @tipoEvento,
        @entidadTipo,
        @entidadId,
        @esAccesoSensible,
        @detalle,
        @direccionIp,
        @userAgent
      )
    `);
};

module.exports = {
  registrarEvento,
};