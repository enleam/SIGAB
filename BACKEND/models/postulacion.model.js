const { sql, getConnection } = require("../config/db");

const buscarConvocatoriaDelSecretario = async (
  convocatoriaId,
  secretarioId
) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input(
      "convocatoriaId",
      sql.BigInt,
      convocatoriaId
    )
    .input(
      "secretarioId",
      sql.BigInt,
      secretarioId
    )
    .query(`
      SELECT
        c.id,
        c.titulo,
        c.estado,
        c.fecha_limite
      FROM convocatorias.Convocatoria c
      WHERE c.id = @convocatoriaId
        AND c.secretario_id = @secretarioId
    `);

  return result.recordset[0] || null;
};

const listarAnonimizadasPorConvocatoria = async (
  convocatoriaId
) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input(
      "convocatoriaId",
      sql.BigInt,
      convocatoriaId
    )
    .query(`
      SELECT
        p.codigo_anonimo,
        p.estado,
        p.fecha_postulacion,
        a.estado AS estado_anonimizacion,
        a.archivo_anonimizado_id
      FROM postulaciones.Postulacion p
      LEFT JOIN ia.AnonimizacionCV a
        ON a.postulacion_id = p.id
        AND a.intento = (
          SELECT MAX(a2.intento)
          FROM ia.AnonimizacionCV a2
          WHERE a2.postulacion_id = p.id
        )
      WHERE p.convocatoria_id = @convocatoriaId
      ORDER BY p.fecha_postulacion ASC
    `);

  return result.recordset;
};

module.exports = {
  buscarConvocatoriaDelSecretario,
  listarAnonimizadasPorConvocatoria,
};