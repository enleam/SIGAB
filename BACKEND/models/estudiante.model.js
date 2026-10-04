const { sql, getConnection } = require("../config/db");

const buscarPorUsuarioId = async (usuarioId) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .query(`
      SELECT
        e.usuario_id,
        e.codigo_estudiante,
        e.nombres,
        e.apellidos,
        e.facultad_id,
        f.nombre AS facultad,
        e.carrera_id,
        c.nombre AS carrera,
        e.ciclo,
        e.telefono,
        e.creado_en,
        e.actualizado_en
      FROM personas.Estudiante e
      INNER JOIN academico.Facultad f
        ON e.facultad_id = f.id
      INNER JOIN academico.Carrera c
        ON e.carrera_id = c.id
      WHERE e.usuario_id = @usuarioId
    `);

  return result.recordset[0] || null;
};

const buscarPorCodigo = async (codigoEstudiante) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("codigoEstudiante", sql.VarChar(20), codigoEstudiante)
    .query(`
      SELECT
        e.usuario_id,
        e.codigo_estudiante,
        e.nombres,
        e.apellidos,
        e.facultad_id,
        f.nombre AS facultad,
        e.carrera_id,
        c.nombre AS carrera,
        e.ciclo,
        e.telefono
      FROM personas.Estudiante e
      INNER JOIN academico.Facultad f
        ON e.facultad_id = f.id
      INNER JOIN academico.Carrera c
        ON e.carrera_id = c.id
      WHERE e.codigo_estudiante = @codigoEstudiante
    `);

  return result.recordset[0] || null;
};

module.exports = {
  buscarPorUsuarioId,
  buscarPorCodigo,
};