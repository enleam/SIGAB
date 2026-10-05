const { getConnection } = require("../config/db");

const ejecutar = async () => {
  const pool = await getConnection();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    await transaction.request().query(`
      DECLARE @constraintName NVARCHAR(128);
      DECLARE @sql NVARCHAR(MAX);

      SELECT TOP 1
        @constraintName = fk.name
      FROM sys.foreign_keys fk
      INNER JOIN sys.foreign_key_columns fkc
        ON fkc.constraint_object_id = fk.object_id
      INNER JOIN sys.columns c
        ON c.object_id = fkc.parent_object_id
        AND c.column_id = fkc.parent_column_id
      WHERE fk.parent_object_id = OBJECT_ID('personas.Secretario')
        AND c.name = 'dependencia_id';

      IF @constraintName IS NOT NULL
      BEGIN
        SET @sql =
          'ALTER TABLE personas.Secretario DROP CONSTRAINT [' +
          @constraintName +
          ']';

        EXEC sp_executesql @sql;
      END;

      IF COL_LENGTH(
        'personas.Secretario',
        'dependencia_id'
      ) IS NOT NULL
      BEGIN
        ALTER TABLE personas.Secretario
        DROP COLUMN dependencia_id;
      END;
    `);

    await transaction.commit();

    console.log(
      "dependencia_id eliminado correctamente de personas.Secretario."
    );
  } catch (error) {
    if (transaction._aborted !== true) {
      await transaction.rollback();
    }

    console.error(
      "Error al actualizar personas.Secretario:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await pool.close();
  }
};

ejecutar();
