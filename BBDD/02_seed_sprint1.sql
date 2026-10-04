/* ============================================================
   SIGAB - Seed Sprint 1
   Datos mínimos para pruebas de autenticación y perfil

   Contraseña de prueba para todos los usuarios:
   Sigab2026!
   ============================================================ */

USE SIGAB;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRY
    BEGIN TRANSACTION;

    /* ============================================================
       1. USUARIOS DE PRUEBA
       ============================================================ */

    INSERT INTO seguridad.Usuario (
        correo_institucional,
        contrasena_hash,
        rol,
        estado,
        correo_verificado,
        ultimo_acceso_en,
        creado_en,
        actualizado_en
    )
    SELECT
        datos.correo_institucional,
        datos.contrasena_hash,
        datos.rol,
        'ACTIVO',
        1,
        NULL,
        datos.creado_en,
        datos.actualizado_en
    FROM (
        VALUES
        (
            'maria.alvar@unmsm.edu.pe',
            '$2b$10$nXs0XddMVyzellh9XRMO6.TpOOrs52c6IMZVz7NVQW2h27M.t9sh.',
            'ESTUDIANTE',
            CAST('2026-09-18T09:12:00' AS DATETIME2(0)),
            CAST('2026-10-01T11:25:00' AS DATETIME2(0))
        ),
        (
            'gabriel.haro@unmsm.edu.pe',
            '$2b$10$fk7WeLbHxhVkcxCdH.GCheGY2rvDmmtHddneqglPxteIApWQ5q9Im',
            'ESTUDIANTE',
            CAST('2026-09-19T10:35:00' AS DATETIME2(0)),
            CAST('2026-10-01T15:42:00' AS DATETIME2(0))
        ),
        (
            'flavio.huapaya@unmsm.edu.pe',
            '$2b$10$7KnhI4g8qPpxvQ9uIUAwyOs8pQx3eE7ujCb89.19mF/ezW3iiDa/G',
            'ESTUDIANTE',
            CAST('2026-09-20T08:18:00' AS DATETIME2(0)),
            CAST('2026-10-02T09:10:00' AS DATETIME2(0))
        ),
        (
            'juan.tocto@unmsm.edu.pe',
            '$2b$10$wWu3HP0N.rji9uUg8b1MHuVEH9/M2o1TqVUfN4HfFS3c9iKabmviW',
            'ESTUDIANTE',
            CAST('2026-09-21T14:24:00' AS DATETIME2(0)),
            CAST('2026-10-02T17:33:00' AS DATETIME2(0))
        ),
        (
            'andre.valenzuela@unmsm.edu.pe',
            '$2b$10$AgN0G5lFaXQ8z.ZXoCsrdunYDJNfgGCU91pmLc3j5ZjfOIMy16iLa',
            'ESTUDIANTE',
            CAST('2026-09-22T11:07:00' AS DATETIME2(0)),
            CAST('2026-10-03T08:51:00' AS DATETIME2(0))
        ),
        (
            'benjamin.velasquez@unmsm.edu.pe',
            '$2b$10$e1GwI1WQoSuBwpMBT8ksGOtYy9p674JOYw4iuTgpZa4wGddNR43nu',
            'ESTUDIANTE',
            CAST('2026-09-23T16:45:00' AS DATETIME2(0)),
            CAST('2026-10-03T10:26:00' AS DATETIME2(0))
        ),
        (
            'secretario.sigab@unmsm.edu.pe',
            '$2b$10$n1sKCDqbjyA3ZF05.9dmFe0dX0iZUSXc51phBGw3c9TE8tpYozFsi',
            'SECRETARIO',
            CAST('2026-09-15T08:30:00' AS DATETIME2(0)),
            CAST('2026-10-03T09:00:00' AS DATETIME2(0))
        ),
        (
            'administrador.sigab@unmsm.edu.pe',
            '$2b$10$PXz6EQChnwfJbcMwztWWUuMgB.M1hm5Gc1vBRUDBDnTiXs8lRCwB2',
            'ADMINISTRADOR',
            CAST('2026-09-15T08:00:00' AS DATETIME2(0)),
            CAST('2026-10-03T09:05:00' AS DATETIME2(0))
        )
    ) AS datos (
        correo_institucional,
        contrasena_hash,
        rol,
        creado_en,
        actualizado_en
    )
    WHERE NOT EXISTS (
        SELECT 1
        FROM seguridad.Usuario u
        WHERE u.correo_institucional =
              datos.correo_institucional
    );


    /* ============================================================
       2. ESTUDIANTES

       Facultad:
       12 = Facultad de Ingeniería de Sistemas e Informática

       Carrera:
       51 = Ingeniería de Sistemas
       ============================================================ */

    INSERT INTO personas.Estudiante (
        usuario_id,
        codigo_estudiante,
        nombres,
        apellidos,
        facultad_id,
        carrera_id,
        ciclo,
        telefono,
        creado_en,
        actualizado_en
    )
    SELECT
        u.id,
        datos.codigo_estudiante,
        datos.nombres,
        datos.apellidos,
        12,
        51,
        8,
        datos.telefono,
        datos.creado_en,
        datos.actualizado_en
    FROM (
        VALUES
        (
            'maria.alvar@unmsm.edu.pe',
            '23200135',
            N'María de Jesús',
            N'Alva Ruíz',
            '900000135',
            CAST('2026-09-18T09:15:00' AS DATETIME2(0)),
            CAST('2026-10-01T11:28:00' AS DATETIME2(0))
        ),
        (
            'gabriel.haro@unmsm.edu.pe',
            '23200027',
            N'Gabriel Anthony',
            N'Haro Jara',
            '900000027',
            CAST('2026-09-19T10:38:00' AS DATETIME2(0)),
            CAST('2026-10-01T15:45:00' AS DATETIME2(0))
        ),
        (
            'flavio.huapaya@unmsm.edu.pe',
            '23200029',
            N'Flavio Enrique',
            N'Huapaya Bohorquez',
            '900000029',
            CAST('2026-09-20T08:21:00' AS DATETIME2(0)),
            CAST('2026-10-02T09:13:00' AS DATETIME2(0))
        ),
        (
            'juan.tocto@unmsm.edu.pe',
            '23200065',
            N'Juan Andrés',
            N'Tocto Caqui',
            '900000065',
            CAST('2026-09-21T14:27:00' AS DATETIME2(0)),
            CAST('2026-10-02T17:36:00' AS DATETIME2(0))
        ),
        (
            'andre.valenzuela@unmsm.edu.pe',
            '23200069',
            N'Andre Alonso',
            N'Valenzuela Falconi',
            '900000069',
            CAST('2026-09-22T11:10:00' AS DATETIME2(0)),
            CAST('2026-10-03T08:54:00' AS DATETIME2(0))
        ),
        (
            'benjamin.velasquez@unmsm.edu.pe',
            '23200071',
            N'Benjamin Isaac',
            N'Velasquez Bohorquez',
            '900000071',
            CAST('2026-09-23T16:48:00' AS DATETIME2(0)),
            CAST('2026-10-03T10:29:00' AS DATETIME2(0))
        )
    ) AS datos (
        correo_institucional,
        codigo_estudiante,
        nombres,
        apellidos,
        telefono,
        creado_en,
        actualizado_en
    )
    INNER JOIN seguridad.Usuario u
        ON u.correo_institucional =
           datos.correo_institucional
    WHERE NOT EXISTS (
        SELECT 1
        FROM personas.Estudiante e
        WHERE e.codigo_estudiante =
              datos.codigo_estudiante
    );


    COMMIT TRANSACTION;

    PRINT 'Seed del Sprint 1 insertado correctamente.';

END TRY
BEGIN CATCH

    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;

END CATCH;
GO


/* ============================================================
   3. VERIFICACIÓN
   ============================================================ */

SELECT
    u.id AS usuario_id,
    u.correo_institucional,
    u.rol,
    u.estado,
    u.correo_verificado
FROM seguridad.Usuario u
WHERE u.correo_institucional IN (
    'maria.alvar@unmsm.edu.pe',
    'gabriel.haro@unmsm.edu.pe',
    'flavio.huapaya@unmsm.edu.pe',
    'juan.tocto@unmsm.edu.pe',
    'andre.valenzuela@unmsm.edu.pe',
    'benjamin.velasquez@unmsm.edu.pe',
    'secretario.sigab@unmsm.edu.pe',
    'administrador.sigab@unmsm.edu.pe'
)
ORDER BY u.rol, u.correo_institucional;


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
    ON f.id = e.facultad_id
INNER JOIN academico.Carrera c
    ON c.id = e.carrera_id
   AND c.facultad_id = e.facultad_id
WHERE e.codigo_estudiante IN (
    '23200135',
    '23200027',
    '23200029',
    '23200065',
    '23200069',
    '23200071'
)
ORDER BY e.codigo_estudiante;
GO