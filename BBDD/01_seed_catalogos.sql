USE SIGAB;
GO

SET XACT_ABORT ON;
GO

BEGIN TRY
    BEGIN TRANSACTION;

    /* ========================================================
       1. ÁREAS ACADÉMICAS
       ======================================================== */

    DECLARE @Areas TABLE (
        codigo CHAR(1) NOT NULL,
        nombre NVARCHAR(100) NOT NULL
    );

    INSERT INTO @Areas (codigo, nombre)
    VALUES

        ('A', N'Ciencias de la Salud'),
        ('B', N'Ciencias Básicas'),
        ('C', N'Ingeniería'),
        ('D', N'Ciencias Económicas y de la Gestión'),
        ('E', N'Humanidades, Ciencias Jurídicas y Sociales');

    INSERT INTO academico.AreaAcademica (codigo, nombre)
    SELECT a.codigo, a.nombre
    FROM @Areas AS a
    WHERE NOT EXISTS (
        SELECT 1
        FROM academico.AreaAcademica AS aa
        WHERE aa.codigo = a.codigo
    );

    /* ========================================================
       2. FACULTADES
       ======================================================== */

    DECLARE @Facultades TABLE (
        codigo VARCHAR(20) NOT NULL,
        nombre NVARCHAR(150) NOT NULL,
        area_codigo CHAR(1) NOT NULL
    );

    INSERT INTO @Facultades (codigo, nombre, area_codigo)
    VALUES

        ('FMED', N'Facultad de Medicina', 'A'),
        ('FFBQ', N'Facultad de Farmacia y Bioquímica', 'A'),
        ('FODO', N'Facultad de Odontología', 'A'),
        ('FMV', N'Facultad de Medicina Veterinaria', 'A'),
        ('FPSI', N'Facultad de Psicología', 'A'),
        ('FCB', N'Facultad de Ciencias Biológicas', 'B'),
        ('FCF', N'Facultad de Ciencias Físicas', 'B'),
        ('FCM', N'Facultad de Ciencias Matemáticas', 'B'),
        ('FIGMMG', N'Facultad de Ingeniería Geológica, Minera, Metalúrgica y Geográfica', 'C'),
        ('FII', N'Facultad de Ingeniería Industrial', 'C'),
        ('FIEE', N'Facultad de Ingeniería Electrónica y Eléctrica', 'C'),
        ('FISI', N'Facultad de Ingeniería de Sistemas e Informática', 'C'),
        ('FQIQ', N'Facultad de Química e Ingeniería Química', 'C'),
        ('FCA', N'Facultad de Ciencias Administrativas', 'D'),
        ('FCC', N'Facultad de Ciencias Contables', 'D'),
        ('FCE', N'Facultad de Ciencias Económicas', 'D'),
        ('FLCH', N'Facultad de Letras y Ciencias Humanas', 'E'),
        ('FEDU', N'Facultad de Educación', 'E'),
        ('FDCP', N'Facultad de Derecho y Ciencia Política', 'E'),
        ('FCS', N'Facultad de Ciencias Sociales', 'E');

    INSERT INTO academico.Facultad (area_academica_id, codigo, nombre)
    SELECT aa.id, f.codigo, f.nombre
    FROM @Facultades AS f
    INNER JOIN academico.AreaAcademica AS aa
        ON aa.codigo = f.area_codigo
    WHERE NOT EXISTS (
        SELECT 1
        FROM academico.Facultad AS existente
        WHERE existente.codigo = f.codigo
    );

    /* ========================================================
       3. CARRERAS
       ======================================================== */

    DECLARE @Carreras TABLE (
        codigo VARCHAR(20) NOT NULL,
        nombre NVARCHAR(150) NOT NULL,
        facultad_codigo VARCHAR(20) NOT NULL
    );

    INSERT INTO @Carreras (codigo, nombre, facultad_codigo)
    VALUES

        ('MEDHUM', N'Medicina Humana', 'FMED'),
        ('OBST', N'Obstetricia', 'FMED'),
        ('ENFER', N'Enfermería', 'FMED'),
        ('TECMED', N'Tecnología Médica', 'FMED'),
        ('NUTRI', N'Nutrición', 'FMED'),
        ('FARMBIOQ', N'Farmacia y Bioquímica', 'FFBQ'),
        ('CIALIM', N'Ciencia de los Alimentos', 'FFBQ'),
        ('TOX', N'Toxicología', 'FFBQ'),
        ('ODONT', N'Odontología', 'FODO'),
        ('MEDVET', N'Medicina Veterinaria', 'FMV'),
        ('PSICO', N'Psicología', 'FPSI'),
        ('PSIORG', N'Psicología Organizacional y de la Gestión Humana', 'FPSI'),
        ('CCBIO', N'Ciencias Biológicas', 'FCB'),
        ('GENBIO', N'Genética y Biotecnología', 'FCB'),
        ('MICPAR', N'Microbiología y Parasitología', 'FCB'),
        ('FISICA', N'Física', 'FCF'),
        ('IMF', N'Ingeniería Mecánica de Fluidos', 'FCF'),
        ('MAT', N'Matemática', 'FCM'),
        ('EST', N'Estadística', 'FCM'),
        ('INVOP', N'Investigación Operativa', 'FCM'),
        ('COMPCIENT', N'Computación Científica', 'FCM'),
        ('INGGEOLOG', N'Ingeniería Geológica', 'FIGMMG'),
        ('INGGEOG', N'Ingeniería Geográfica', 'FIGMMG'),
        ('INGMINAS', N'Ingeniería de Minas', 'FIGMMG'),
        ('INGMET', N'Ingeniería Metalúrgica', 'FIGMMG'),
        ('INGCIV', N'Ingeniería Civil', 'FIGMMG'),
        ('INGAMB', N'Ingeniería Ambiental', 'FIGMMG'),
        ('INGIND', N'Ingeniería Industrial', 'FII'),
        ('INGTEXT', N'Ingeniería Textil y Confecciones', 'FII'),
        ('INGSST', N'Ingeniería de Seguridad y Salud en el Trabajo', 'FII'),
        ('INGLOG', N'Ingeniería Logística y Cadena de Suministro Digital', 'FII'),
        ('INGTRANSF', N'Ingeniería de Transportes y Sistemas Ferroviarios', 'FII'),
        ('INGELEC', N'Ingeniería Electrónica', 'FIEE'),
        ('INGELECT', N'Ingeniería Eléctrica', 'FIEE'),
        ('INGTEL', N'Ingeniería de Telecomunicaciones', 'FIEE'),
        ('INGBIOM', N'Ingeniería Biomédica', 'FIEE'),
        ('INGSIS', N'Ingeniería de Sistemas', 'FISI'),
        ('INGSOFT', N'Ingeniería de Software', 'FISI'),
        ('CCOMP', N'Ciencias de la Computación', 'FISI'),
        ('QUIM', N'Química', 'FQIQ'),
        ('INGQUIM', N'Ingeniería Química', 'FQIQ'),
        ('INGAGRO', N'Ingeniería Agroindustrial', 'FQIQ'),
        ('ADM', N'Administración', 'FCA'),
        ('ADMTUR', N'Administración de Turismo', 'FCA'),
        ('ADMNEGINT', N'Administración de Negocios Internacionales', 'FCA'),
        ('ADMMAR', N'Administración Marítima y Portuaria', 'FCA'),
        ('ADMGAST', N'Administración de la Gastronomía', 'FCA'),
        ('MARK', N'Marketing', 'FCA'),
        ('CONT', N'Contabilidad', 'FCC'),
        ('GESTTRIB', N'Gestión Tributaria', 'FCC'),
        ('AUDESP', N'Auditoría Empresarial y del Sector Público', 'FCC'),
        ('PRESFINPUB', N'Presupuesto y Finanzas Públicas', 'FCC'),
        ('ECON', N'Economía', 'FCE'),
        ('ECONPUB', N'Economía Pública', 'FCE'),
        ('ECONINT', N'Economía Internacional', 'FCE'),
        ('LIT', N'Literatura', 'FLCH'),
        ('FILO', N'Filosofía', 'FLCH'),
        ('LING', N'Lingüística', 'FLCH'),
        ('COMSOC', N'Comunicación Social', 'FLCH'),
        ('ARTE', N'Arte', 'FLCH'),
        ('CONREST', N'Conservación y Restauración', 'FLCH'),
        ('BIBINFO', N'Bibliotecología y Ciencias de la Información', 'FLCH'),
        ('DANZA', N'Danza', 'FLCH'),
        ('LENTRADINT', N'Lenguas, Traducción e Interpretación', 'FLCH'),
        ('EDU', N'Educación', 'FEDU'),
        ('EDUFIS', N'Educación Física', 'FEDU'),
        ('DERECHO', N'Derecho', 'FDCP'),
        ('CPOL', N'Ciencia Política', 'FDCP'),
        ('HIST', N'Historia', 'FCS'),
        ('SOCIO', N'Sociología', 'FCS'),
        ('ANTRO', N'Antropología', 'FCS'),
        ('ARQUEO', N'Arqueología', 'FCS'),
        ('TRABSOC', N'Trabajo Social', 'FCS'),
        ('GEOG', N'Geografía', 'FCS');

    INSERT INTO academico.Carrera (facultad_id, codigo, nombre)
    SELECT f.id, c.codigo, c.nombre
    FROM @Carreras AS c
    INNER JOIN academico.Facultad AS f
        ON f.codigo = c.facultad_codigo
    WHERE NOT EXISTS (
        SELECT 1
        FROM academico.Carrera AS existente
        WHERE existente.codigo = c.codigo
    );

    /* ========================================================
       4. DEPENDENCIAS INSTITUCIONALES INICIALES
       ======================================================== */

    DECLARE @Dependencias TABLE (
        codigo VARCHAR(30) NOT NULL,
        nombre NVARCHAR(180) NOT NULL,
        tipo VARCHAR(30) NOT NULL
    );

    INSERT INTO @Dependencias (codigo, nombre, tipo)
    VALUES

        ('BCPZ', N'Biblioteca Central Pedro Zulen', 'DEPENDENCIA_ADMINISTRATIVA'),
        ('CEID', N'Centro de Idiomas de la UNMSM (CEID)', 'DEPENDENCIA_ADMINISTRATIVA'),
        ('AAP', N'Autoseguro de Accidentes Personales', 'DEPENDENCIA_ADMINISTRATIVA');

    INSERT INTO institucional.Dependencia
        (facultad_id, codigo, nombre, tipo)
    SELECT
        NULL,
        d.codigo,
        d.nombre,
        d.tipo
    FROM @Dependencias AS d
    WHERE NOT EXISTS (
        SELECT 1
        FROM institucional.Dependencia AS existente
        WHERE existente.codigo = d.codigo
    );

    /* ========================================================
       5. PERIODO ACADÉMICO ACTUAL: 2026-II
       Clases: 24/08/2026 - 12/12/2026
       ======================================================== */

    -- Solo un periodo debe quedar marcado como actual.
    UPDATE academico.PeriodoAcademico
    SET es_actual = 0
    WHERE es_actual = 1
      AND codigo <> '2026-II';

    IF EXISTS (
        SELECT 1
        FROM academico.PeriodoAcademico
        WHERE codigo = '2026-II'
    )
    BEGIN
        UPDATE academico.PeriodoAcademico
        SET nombre = N'Periodo Académico 2026-II',
            fecha_inicio = '20260824',
            fecha_fin = '20261212',
            es_actual = 1,
            activo = 1
        WHERE codigo = '2026-II';
    END
    ELSE
    BEGIN
        INSERT INTO academico.PeriodoAcademico
            (codigo, nombre, fecha_inicio, fecha_fin, es_actual, activo)
        VALUES
            ('2026-II', N'Periodo Académico 2026-II',
             '20260824', '20261212', 1, 1);
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO

/* ============================================================
   VERIFICACIÓN DEL SEED
   ============================================================ */

SELECT codigo, nombre
FROM academico.AreaAcademica
ORDER BY codigo;

SELECT
    aa.codigo AS area,
    f.codigo AS facultad_codigo,
    f.nombre AS facultad
FROM academico.Facultad AS f
INNER JOIN academico.AreaAcademica AS aa
    ON aa.id = f.area_academica_id
ORDER BY aa.codigo, f.nombre;

SELECT
    f.codigo AS facultad_codigo,
    f.nombre AS facultad,
    c.codigo AS carrera_codigo,
    c.nombre AS carrera
FROM academico.Carrera AS c
INNER JOIN academico.Facultad AS f
    ON f.id = c.facultad_id
ORDER BY f.nombre, c.nombre;

SELECT codigo, nombre, tipo
FROM institucional.Dependencia
ORDER BY nombre;

SELECT
    codigo,
    nombre,
    fecha_inicio,
    fecha_fin,
    es_actual,
    activo
FROM academico.PeriodoAcademico
ORDER BY fecha_inicio DESC;
GO

/* ============================================================
   REGLA DE NEGOCIO IMPORTANTE

   Tener un registro en personas.Estudiante NO habilita por sí solo
   al estudiante para postular.

   Cuando posteriormente se carguen estudiantes, cada uno tendrá
   un registro en academico.MatriculaEstudiante para 2026-II.

   Solo se permitirá postular cuando:
       - periodo = 2026-II
       - es_actual = 1
       - esta_matriculado = 1

   Esta regla debe validarse en el backend al registrar la postulación.
   ============================================================ */