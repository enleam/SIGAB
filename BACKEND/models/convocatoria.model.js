
const { sql, getConnection } = require("../config/db");

// HU04 - Listar convocatorias según los requisitos
// académicos del estudiante autenticado.
const listarElegiblesPorEstudiante = async (usuarioId) => {
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("usuarioId", sql.BigInt, usuarioId)
    .query(`
      SELECT
        c.id,
        c.titulo,
        c.descripcion,
        c.funciones,
        c.requisitos,
        c.vacantes,
        c.horario,
        c.tipo_trabajo,
        c.remuneracion,
        c.fecha_inicio,
        c.fecha_limite,
        c.alcance,
        c.estado,
        c.periodo_id,
        c.dependencia_id,
        d.nombre AS dependencia,
        c.publicada_en
      FROM convocatorias.Convocatoria c
      INNER JOIN institucional.Dependencia d
        ON d.id = c.dependencia_id
      INNER JOIN personas.Estudiante e
        ON e.usuario_id = @usuarioId
      WHERE
        c.estado = 'PUBLICADA'
        AND c.fecha_inicio <=
            CAST(SYSDATETIME() AS DATE)
        AND c.fecha_limite >= SYSDATETIME()

        -- Validar matrícula en el periodo
        -- académico de la convocatoria
        AND EXISTS (
          SELECT 1
          FROM academico.MatriculaEstudiante m
          WHERE m.estudiante_id = e.usuario_id
            AND m.periodo_id = c.periodo_id
            AND m.esta_matriculado = 1
        )

        -- Validar facultad cuando exista
        -- una restricción de facultades
        AND (
          NOT EXISTS (
            SELECT 1
            FROM convocatorias.ConvocatoriaFacultad cf
            WHERE cf.convocatoria_id = c.id
          )
          OR EXISTS (
            SELECT 1
            FROM convocatorias.ConvocatoriaFacultad cf
            WHERE cf.convocatoria_id = c.id
              AND cf.facultad_id = e.facultad_id
          )
        )

        -- Validar carrera cuando exista
        -- una restricción de carreras
        AND (
          NOT EXISTS (
            SELECT 1
            FROM convocatorias.ConvocatoriaCarrera cc
            WHERE cc.convocatoria_id = c.id
          )
          OR EXISTS (
            SELECT 1
            FROM convocatorias.ConvocatoriaCarrera cc
            WHERE cc.convocatoria_id = c.id
              AND cc.carrera_id = e.carrera_id
          )
        )
      ORDER BY
        c.fecha_limite ASC,
        c.id DESC
    `);

  return result.recordset;
};

module.exports = {
  listarElegiblesPorEstudiante,
};
