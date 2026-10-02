/* ============================================================
   SIGAB - Sistema Integrado de Gestión y Asignación de Bolsistas
   ============================================================ */

IF DB_ID(N'SIGAB') IS NULL
BEGIN
    CREATE DATABASE SIGAB;
END;
GO

USE SIGAB;
GO

/* ============================================================
   0. ESQUEMAS
   ============================================================ */

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'academico')
    EXEC('CREATE SCHEMA academico');
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'institucional')
    EXEC('CREATE SCHEMA institucional');
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'personas')
    EXEC('CREATE SCHEMA personas');
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'seguridad')
    EXEC('CREATE SCHEMA seguridad');
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'documentos')
    EXEC('CREATE SCHEMA documentos');
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'convocatorias')
    EXEC('CREATE SCHEMA convocatorias');
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'postulaciones')
    EXEC('CREATE SCHEMA postulaciones');
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'ia')
    EXEC('CREATE SCHEMA ia');
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'notificaciones')
    EXEC('CREATE SCHEMA notificaciones');
GO


/* ============================================================
   1. ESTRUCTURA ACADÉMICA
   ============================================================ */

CREATE TABLE academico.Facultad (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    codigo              VARCHAR(20) NOT NULL,
    nombre              NVARCHAR(150) NOT NULL,
    activo              BIT NOT NULL CONSTRAINT DF_Facultad_Activo DEFAULT (1),
    creado_en           DATETIME2(0) NOT NULL CONSTRAINT DF_Facultad_Creado DEFAULT (SYSDATETIME()),
    actualizado_en      DATETIME2(0) NOT NULL CONSTRAINT DF_Facultad_Actualizado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Facultad PRIMARY KEY (id),
    CONSTRAINT UQ_Facultad_Codigo UNIQUE (codigo),
    CONSTRAINT UQ_Facultad_Nombre UNIQUE (nombre)
);
GO

CREATE TABLE academico.Carrera (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    facultad_id         BIGINT NOT NULL,
    codigo              VARCHAR(20) NOT NULL,
    nombre              NVARCHAR(150) NOT NULL,
    activo              BIT NOT NULL CONSTRAINT DF_Carrera_Activo DEFAULT (1),
    creado_en           DATETIME2(0) NOT NULL CONSTRAINT DF_Carrera_Creado DEFAULT (SYSDATETIME()),
    actualizado_en      DATETIME2(0) NOT NULL CONSTRAINT DF_Carrera_Actualizado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Carrera PRIMARY KEY (id),
    CONSTRAINT UQ_Carrera_Codigo UNIQUE (codigo),
    CONSTRAINT UQ_Carrera_Facultad_Nombre UNIQUE (facultad_id, nombre),
    CONSTRAINT UQ_Carrera_Id_Facultad UNIQUE (id, facultad_id),

    CONSTRAINT FK_Carrera_Facultad
        FOREIGN KEY (facultad_id)
        REFERENCES academico.Facultad(id)
);
GO

CREATE TABLE academico.PeriodoAcademico (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    codigo              VARCHAR(20) NOT NULL,
    nombre              NVARCHAR(80) NOT NULL,
    fecha_inicio        DATE NOT NULL,
    fecha_fin           DATE NOT NULL,
    es_actual           BIT NOT NULL CONSTRAINT DF_Periodo_EsActual DEFAULT (0),
    activo              BIT NOT NULL CONSTRAINT DF_Periodo_Activo DEFAULT (1),
    creado_en           DATETIME2(0) NOT NULL CONSTRAINT DF_Periodo_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_PeriodoAcademico PRIMARY KEY (id),
    CONSTRAINT UQ_Periodo_Codigo UNIQUE (codigo),
    CONSTRAINT CK_Periodo_Fechas CHECK (fecha_fin >= fecha_inicio)
);
GO


/* ============================================================
   2. ESTRUCTURA INSTITUCIONAL
   ============================================================ */

CREATE TABLE institucional.Dependencia (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    facultad_id         BIGINT NULL,
    codigo              VARCHAR(30) NOT NULL,
    nombre              NVARCHAR(180) NOT NULL,
    tipo                VARCHAR(30) NOT NULL,
    activo              BIT NOT NULL CONSTRAINT DF_Dependencia_Activo DEFAULT (1),
    creado_en           DATETIME2(0) NOT NULL CONSTRAINT DF_Dependencia_Creado DEFAULT (SYSDATETIME()),
    actualizado_en      DATETIME2(0) NOT NULL CONSTRAINT DF_Dependencia_Actualizado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Dependencia PRIMARY KEY (id),
    CONSTRAINT UQ_Dependencia_Codigo UNIQUE (codigo),
    CONSTRAINT UQ_Dependencia_Nombre UNIQUE (nombre),

    CONSTRAINT CK_Dependencia_Tipo CHECK (
        tipo IN ('FACULTAD', 'DEPENDENCIA_ADMINISTRATIVA', 'OTRA')
    ),

    CONSTRAINT FK_Dependencia_Facultad
        FOREIGN KEY (facultad_id)
        REFERENCES academico.Facultad(id)
);
GO


/* ============================================================
   3. SEGURIDAD Y AUTENTICACIÓN
   ============================================================ */

CREATE TABLE seguridad.Usuario (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    correo_institucional VARCHAR(180) NOT NULL,
    contrasena_hash      VARCHAR(255) NULL,
    rol                  VARCHAR(20) NOT NULL
                         CONSTRAINT DF_Usuario_Rol DEFAULT ('ESTUDIANTE'),
    estado               VARCHAR(20) NOT NULL
                         CONSTRAINT DF_Usuario_Estado DEFAULT ('ACTIVO'),
    correo_verificado    BIT NOT NULL
                         CONSTRAINT DF_Usuario_CorreoVerificado DEFAULT (0),
    ultimo_acceso_en     DATETIME2(0) NULL,
    creado_en            DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Usuario_Creado DEFAULT (SYSDATETIME()),
    actualizado_en       DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Usuario_Actualizado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Usuario PRIMARY KEY (id),
    CONSTRAINT UQ_Usuario_Correo UNIQUE (correo_institucional),

    CONSTRAINT CK_Usuario_Rol CHECK (
        rol IN ('ADMINISTRADOR', 'SECRETARIO', 'ESTUDIANTE')
    ),

    CONSTRAINT CK_Usuario_Estado CHECK (
        estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO')
    ),

    CONSTRAINT CK_Usuario_CorreoUNMSM CHECK (
        LOWER(correo_institucional) LIKE '%@unmsm.edu.pe'
    )
);
GO

CREATE TABLE seguridad.TokenRestablecimiento (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    usuario_id          BIGINT NOT NULL,
    token_hash          CHAR(64) NOT NULL,
    expira_en           DATETIME2(0) NOT NULL,
    usado_en            DATETIME2(0) NULL,
    creado_en           DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Token_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_TokenRestablecimiento PRIMARY KEY (id),
    CONSTRAINT UQ_Token_Hash UNIQUE (token_hash),

    CONSTRAINT FK_Token_Usuario
        FOREIGN KEY (usuario_id)
        REFERENCES seguridad.Usuario(id)
);
GO

CREATE INDEX IX_Token_Usuario_Expira
    ON seguridad.TokenRestablecimiento(usuario_id, expira_en);
GO

CREATE TABLE seguridad.ConsentimientoDatos (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    usuario_id          BIGINT NOT NULL,
    version_terminos    VARCHAR(40) NOT NULL,
    aceptado_en         DATETIME2(0) NOT NULL,
    revocado_en         DATETIME2(0) NULL,
    direccion_ip        VARCHAR(45) NULL,
    creado_en           DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Consentimiento_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_ConsentimientoDatos PRIMARY KEY (id),
    CONSTRAINT UQ_Consentimiento_Usuario_Version
        UNIQUE (usuario_id, version_terminos),

    CONSTRAINT FK_Consentimiento_Usuario
        FOREIGN KEY (usuario_id)
        REFERENCES seguridad.Usuario(id)
);
GO


/* ============================================================
   4. PERSONAS
   ============================================================ */

CREATE TABLE personas.Estudiante (
    usuario_id          BIGINT NOT NULL,
    codigo_estudiante   VARCHAR(20) NOT NULL,
    nombres             NVARCHAR(120) NOT NULL,
    apellidos           NVARCHAR(160) NOT NULL,
    facultad_id         BIGINT NOT NULL,
    carrera_id          BIGINT NOT NULL,
    ciclo               TINYINT NOT NULL,
    telefono            VARCHAR(25) NULL,
    creado_en           DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Estudiante_Creado DEFAULT (SYSDATETIME()),
    actualizado_en      DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Estudiante_Actualizado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Estudiante PRIMARY KEY (usuario_id),
    CONSTRAINT UQ_Estudiante_Codigo UNIQUE (codigo_estudiante),
    CONSTRAINT CK_Estudiante_Ciclo CHECK (ciclo BETWEEN 1 AND 20),

    CONSTRAINT FK_Estudiante_Usuario
        FOREIGN KEY (usuario_id)
        REFERENCES seguridad.Usuario(id),

    CONSTRAINT FK_Estudiante_Facultad
        FOREIGN KEY (facultad_id)
        REFERENCES academico.Facultad(id),

    CONSTRAINT FK_Estudiante_CarreraFacultad
        FOREIGN KEY (carrera_id, facultad_id)
        REFERENCES academico.Carrera(id, facultad_id)
);
GO

CREATE TABLE personas.Secretario (
    usuario_id          BIGINT NOT NULL,
    nombres             NVARCHAR(120) NOT NULL,
    apellidos           NVARCHAR(160) NOT NULL,
    dependencia_id      BIGINT NOT NULL,
    cargo               NVARCHAR(120) NULL,
    creado_en           DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Secretario_Creado DEFAULT (SYSDATETIME()),
    actualizado_en      DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Secretario_Actualizado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Secretario PRIMARY KEY (usuario_id),

    CONSTRAINT FK_Secretario_Usuario
        FOREIGN KEY (usuario_id)
        REFERENCES seguridad.Usuario(id),

    CONSTRAINT FK_Secretario_Dependencia
        FOREIGN KEY (dependencia_id)
        REFERENCES institucional.Dependencia(id)
);
GO


/* ============================================================
   5. MATRÍCULA
   ============================================================ */

CREATE TABLE academico.MatriculaEstudiante (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    estudiante_id        BIGINT NOT NULL,
    periodo_id           BIGINT NOT NULL,
    esta_matriculado     BIT NOT NULL
                         CONSTRAINT DF_Matricula_Estado DEFAULT (0),
    fuente_verificacion  NVARCHAR(100) NULL,
    verificado_en        DATETIME2(0) NULL,
    creado_en            DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Matricula_Creado DEFAULT (SYSDATETIME()),
    actualizado_en       DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Matricula_Actualizado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_MatriculaEstudiante PRIMARY KEY (id),

    CONSTRAINT UQ_Matricula_Estudiante_Periodo
        UNIQUE (estudiante_id, periodo_id),

    CONSTRAINT FK_Matricula_Estudiante
        FOREIGN KEY (estudiante_id)
        REFERENCES personas.Estudiante(usuario_id),

    CONSTRAINT FK_Matricula_Periodo
        FOREIGN KEY (periodo_id)
        REFERENCES academico.PeriodoAcademico(id)
);
GO

CREATE INDEX IX_Matricula_Periodo_Estado
    ON academico.MatriculaEstudiante(periodo_id, esta_matriculado);
GO


/* ============================================================
   6. DOCUMENTOS
   ============================================================ */

CREATE TABLE documentos.Archivo (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    nombre_original      NVARCHAR(255) NOT NULL,
    nombre_almacenado    NVARCHAR(255) NOT NULL,
    ruta_almacenamiento  NVARCHAR(500) NOT NULL,
    mime_type            VARCHAR(100) NOT NULL,
    tamano_bytes         BIGINT NOT NULL,
    hash_sha256          CHAR(64) NULL,
    creado_en            DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Archivo_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Archivo PRIMARY KEY (id),
    CONSTRAINT CK_Archivo_Tamano CHECK (tamano_bytes > 0)
);
GO

CREATE TABLE documentos.DocumentoEstudiante (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    estudiante_id       BIGINT NOT NULL,
    archivo_id          BIGINT NOT NULL,
    tipo                VARCHAR(20) NOT NULL
                        CONSTRAINT DF_Documento_Tipo DEFAULT ('CV'),
    vigente             BIT NOT NULL
                        CONSTRAINT DF_Documento_Vigente DEFAULT (1),
    cargado_en          DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Documento_Cargado DEFAULT (SYSDATETIME()),
    desactivado_en      DATETIME2(0) NULL,

    CONSTRAINT PK_DocumentoEstudiante PRIMARY KEY (id),
    CONSTRAINT UQ_Documento_Id_Estudiante UNIQUE (id, estudiante_id),

    CONSTRAINT CK_Documento_Tipo CHECK (
        tipo IN ('CV', 'OTRO')
    ),

    CONSTRAINT FK_Documento_Estudiante
        FOREIGN KEY (estudiante_id)
        REFERENCES personas.Estudiante(usuario_id),

    CONSTRAINT FK_Documento_Archivo
        FOREIGN KEY (archivo_id)
        REFERENCES documentos.Archivo(id)
);
GO

CREATE INDEX IX_Documento_Estudiante_Vigente
    ON documentos.DocumentoEstudiante(estudiante_id, tipo, vigente);
GO


/* ============================================================
   7. CONVOCATORIAS
   ============================================================ */

CREATE TABLE convocatorias.Convocatoria (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    secretario_id        BIGINT NOT NULL,
    dependencia_id       BIGINT NOT NULL,
    periodo_id           BIGINT NOT NULL,

    titulo               NVARCHAR(200) NOT NULL,
    descripcion          NVARCHAR(MAX) NOT NULL,
    funciones            NVARCHAR(MAX) NOT NULL,
    requisitos           NVARCHAR(MAX) NOT NULL,
    vacantes             INT NOT NULL,
    horario              NVARCHAR(255) NOT NULL,
    tipo_trabajo         NVARCHAR(100) NOT NULL,
    remuneracion         DECIMAL(10,2) NOT NULL,
    fecha_inicio         DATE NOT NULL,
    fecha_limite         DATETIME2(0) NOT NULL,

    alcance              VARCHAR(20) NOT NULL
                         CONSTRAINT DF_Convocatoria_Alcance DEFAULT ('ABIERTO'),

    estado               VARCHAR(20) NOT NULL
                         CONSTRAINT DF_Convocatoria_Estado DEFAULT ('BORRADOR'),

    motivo_cancelacion   NVARCHAR(500) NULL,
    publicada_en         DATETIME2(0) NULL,
    cerrada_en           DATETIME2(0) NULL,
    creada_en            DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Convocatoria_Creada DEFAULT (SYSDATETIME()),
    actualizada_en       DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Convocatoria_Actualizada DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Convocatoria PRIMARY KEY (id),

    CONSTRAINT CK_Convocatoria_Vacantes CHECK (vacantes > 0),

    CONSTRAINT CK_Convocatoria_Remuneracion CHECK (remuneracion >= 0),

    CONSTRAINT CK_Convocatoria_Fechas CHECK (
        fecha_inicio <= CAST(fecha_limite AS DATE)
    ),

    CONSTRAINT CK_Convocatoria_Alcance CHECK (
        alcance IN ('ABIERTO', 'RESTRINGIDO')
    ),

    CONSTRAINT CK_Convocatoria_Estado CHECK (
        estado IN (
            'BORRADOR',
            'PUBLICADA',
            'CERRADA',
            'CANCELADA',
            'DESIERTA',
            'SUSPENDIDA'
        )
    ),

    CONSTRAINT FK_Convocatoria_Secretario
        FOREIGN KEY (secretario_id)
        REFERENCES personas.Secretario(usuario_id),

    CONSTRAINT FK_Convocatoria_Dependencia
        FOREIGN KEY (dependencia_id)
        REFERENCES institucional.Dependencia(id),

    CONSTRAINT FK_Convocatoria_Periodo
        FOREIGN KEY (periodo_id)
        REFERENCES academico.PeriodoAcademico(id)
);
GO

CREATE INDEX IX_Convocatoria_Estado_Fecha
    ON convocatorias.Convocatoria(estado, fecha_limite);
GO

CREATE INDEX IX_Convocatoria_Dependencia
    ON convocatorias.Convocatoria(dependencia_id);
GO

CREATE INDEX IX_Convocatoria_Periodo
    ON convocatorias.Convocatoria(periodo_id);
GO

CREATE TABLE convocatorias.ConvocatoriaFacultad (
    convocatoria_id     BIGINT NOT NULL,
    facultad_id         BIGINT NOT NULL,

    CONSTRAINT PK_ConvocatoriaFacultad
        PRIMARY KEY (convocatoria_id, facultad_id),

    CONSTRAINT FK_ConvFac_Convocatoria
        FOREIGN KEY (convocatoria_id)
        REFERENCES convocatorias.Convocatoria(id),

    CONSTRAINT FK_ConvFac_Facultad
        FOREIGN KEY (facultad_id)
        REFERENCES academico.Facultad(id)
);
GO

CREATE TABLE convocatorias.ConvocatoriaCarrera (
    convocatoria_id     BIGINT NOT NULL,
    carrera_id          BIGINT NOT NULL,

    CONSTRAINT PK_ConvocatoriaCarrera
        PRIMARY KEY (convocatoria_id, carrera_id),

    CONSTRAINT FK_ConvCar_Convocatoria
        FOREIGN KEY (convocatoria_id)
        REFERENCES convocatorias.Convocatoria(id),

    CONSTRAINT FK_ConvCar_Carrera
        FOREIGN KEY (carrera_id)
        REFERENCES academico.Carrera(id)
);
GO

CREATE TABLE convocatorias.ConvocatoriaDocumentoRequerido (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    convocatoria_id     BIGINT NOT NULL,
    nombre              NVARCHAR(150) NOT NULL,
    descripcion         NVARCHAR(500) NULL,
    obligatorio         BIT NOT NULL
                        CONSTRAINT DF_ConvDoc_Obligatorio DEFAULT (1),
    creado_en           DATETIME2(0) NOT NULL
                        CONSTRAINT DF_ConvDoc_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_ConvocatoriaDocumentoRequerido PRIMARY KEY (id),

    CONSTRAINT UQ_ConvDoc_Nombre
        UNIQUE (convocatoria_id, nombre),

    CONSTRAINT FK_ConvDoc_Convocatoria
        FOREIGN KEY (convocatoria_id)
        REFERENCES convocatorias.Convocatoria(id)
);
GO


/* ============================================================
   8. POSTULACIONES
   ============================================================ */

CREATE TABLE postulaciones.Postulacion (
    id                   BIGINT IDENTITY(1,1) NOT NULL,
    convocatoria_id      BIGINT NOT NULL,
    estudiante_id        BIGINT NOT NULL,
    cv_documento_id      BIGINT NOT NULL,

    codigo_anonimo       CHAR(16) NOT NULL,

    estado               VARCHAR(25) NOT NULL
                         CONSTRAINT DF_Postulacion_Estado DEFAULT ('REGISTRADA'),

    fecha_postulacion    DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Postulacion_Fecha DEFAULT (SYSDATETIME()),

    retirada_en          DATETIME2(0) NULL,
    motivo_retiro        NVARCHAR(500) NULL,

    actualizada_en       DATETIME2(0) NOT NULL
                         CONSTRAINT DF_Postulacion_Actualizada DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Postulacion PRIMARY KEY (id),

    CONSTRAINT UQ_Postulacion_Estudiante_Convocatoria
        UNIQUE (convocatoria_id, estudiante_id),

    CONSTRAINT UQ_Postulacion_CodigoAnonimo
        UNIQUE (codigo_anonimo),

    CONSTRAINT CK_Postulacion_Estado CHECK (
        estado IN (
            'REGISTRADA',
            'EN_REVISION',
            'PRESELECCIONADA',
            'ACEPTADA',
            'RECHAZADA',
            'CANCELADA',
            'NO_SELECCIONADA'
        )
    ),

    CONSTRAINT FK_Postulacion_Convocatoria
        FOREIGN KEY (convocatoria_id)
        REFERENCES convocatorias.Convocatoria(id),

    CONSTRAINT FK_Postulacion_Estudiante
        FOREIGN KEY (estudiante_id)
        REFERENCES personas.Estudiante(usuario_id),

    CONSTRAINT FK_Postulacion_CV_Estudiante
        FOREIGN KEY (cv_documento_id, estudiante_id)
        REFERENCES documentos.DocumentoEstudiante(id, estudiante_id)
);
GO

CREATE INDEX IX_Postulacion_Convocatoria_Estado
    ON postulaciones.Postulacion(convocatoria_id, estado);
GO

CREATE INDEX IX_Postulacion_Estudiante_Estado
    ON postulaciones.Postulacion(estudiante_id, estado);
GO

CREATE TABLE postulaciones.PostulacionDocumento (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    postulacion_id      BIGINT NOT NULL,
    requisito_id        BIGINT NOT NULL,
    archivo_id          BIGINT NOT NULL,
    cargado_en          DATETIME2(0) NOT NULL
                        CONSTRAINT DF_PostDoc_Cargado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_PostulacionDocumento PRIMARY KEY (id),

    CONSTRAINT UQ_Postulacion_Requisito
        UNIQUE (postulacion_id, requisito_id),

    CONSTRAINT FK_PostDoc_Postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones.Postulacion(id),

    CONSTRAINT FK_PostDoc_Requisito
        FOREIGN KEY (requisito_id)
        REFERENCES convocatorias.ConvocatoriaDocumentoRequerido(id),

    CONSTRAINT FK_PostDoc_Archivo
        FOREIGN KEY (archivo_id)
        REFERENCES documentos.Archivo(id)
);
GO

CREATE TABLE postulaciones.HistorialEstadoPostulacion (
    id                       BIGINT IDENTITY(1,1) NOT NULL,
    postulacion_id           BIGINT NOT NULL,
    cambiado_por_usuario_id  BIGINT NULL,
    estado_anterior          VARCHAR(25) NULL,
    estado_nuevo             VARCHAR(25) NOT NULL,
    observacion              NVARCHAR(800) NULL,
    creado_en                DATETIME2(0) NOT NULL
                             CONSTRAINT DF_HistPost_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_HistorialEstadoPostulacion PRIMARY KEY (id),

    CONSTRAINT CK_HistPost_EstadoAnterior CHECK (
        estado_anterior IS NULL OR estado_anterior IN (
            'REGISTRADA',
            'EN_REVISION',
            'PRESELECCIONADA',
            'ACEPTADA',
            'RECHAZADA',
            'CANCELADA',
            'NO_SELECCIONADA'
        )
    ),

    CONSTRAINT CK_HistPost_EstadoNuevo CHECK (
        estado_nuevo IN (
            'REGISTRADA',
            'EN_REVISION',
            'PRESELECCIONADA',
            'ACEPTADA',
            'RECHAZADA',
            'CANCELADA',
            'NO_SELECCIONADA'
        )
    ),

    CONSTRAINT FK_HistPost_Postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones.Postulacion(id),

    CONSTRAINT FK_HistPost_Usuario
        FOREIGN KEY (cambiado_por_usuario_id)
        REFERENCES seguridad.Usuario(id)
);
GO

CREATE INDEX IX_HistPost_Postulacion_Fecha
    ON postulaciones.HistorialEstadoPostulacion(postulacion_id, creado_en);
GO


/* ============================================================
   9. IA - ANONIMIZACIÓN
   ============================================================ */

CREATE TABLE ia.AnonimizacionCV (
    id                      BIGINT IDENTITY(1,1) NOT NULL,
    postulacion_id          BIGINT NOT NULL,
    intento                 SMALLINT NOT NULL
                            CONSTRAINT DF_Anonimizacion_Intento DEFAULT (1),

    estado                  VARCHAR(25) NOT NULL
                            CONSTRAINT DF_Anonimizacion_Estado DEFAULT ('PENDIENTE'),

    archivo_anonimizado_id  BIGINT NULL,
    motor_ia                NVARCHAR(120) NULL,
    version_motor           NVARCHAR(80) NULL,

    categorias_detectadas   NVARCHAR(MAX) NULL,
    detalle_incidencia      NVARCHAR(1000) NULL,

    iniciado_en             DATETIME2(0) NULL,
    finalizado_en           DATETIME2(0) NULL,

    creado_en               DATETIME2(0) NOT NULL
                            CONSTRAINT DF_Anonimizacion_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_AnonimizacionCV PRIMARY KEY (id),

    CONSTRAINT UQ_Anonimizacion_Intento
        UNIQUE (postulacion_id, intento),

    CONSTRAINT CK_Anonimizacion_Estado CHECK (
        estado IN (
            'PENDIENTE',
            'PROCESANDO',
            'COMPLETADA',
            'FALLIDA',
            'REQUIERE_REVISION'
        )
    ),

    CONSTRAINT CK_Anonimizacion_Categorias_JSON CHECK (
        categorias_detectadas IS NULL
        OR ISJSON(categorias_detectadas) = 1
    ),

    CONSTRAINT FK_Anonimizacion_Postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones.Postulacion(id),

    CONSTRAINT FK_Anonimizacion_Archivo
        FOREIGN KEY (archivo_anonimizado_id)
        REFERENCES documentos.Archivo(id)
);
GO

CREATE INDEX IX_Anonimizacion_Postulacion_Estado
    ON ia.AnonimizacionCV(postulacion_id, estado);
GO


/* ============================================================
   10. MODERACIÓN DE CONVOCATORIAS
   ============================================================ */

CREATE TABLE convocatorias.ModeracionConvocatoria (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    convocatoria_id     BIGINT NOT NULL,
    administrador_id    BIGINT NOT NULL,
    accion              VARCHAR(20) NOT NULL,
    motivo              NVARCHAR(800) NOT NULL,
    creado_en           DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Moderacion_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_ModeracionConvocatoria PRIMARY KEY (id),

    CONSTRAINT CK_Moderacion_Accion CHECK (
        accion IN ('SUSPENDER', 'REACTIVAR', 'CANCELAR')
    ),

    CONSTRAINT FK_Moderacion_Convocatoria
        FOREIGN KEY (convocatoria_id)
        REFERENCES convocatorias.Convocatoria(id),

    CONSTRAINT FK_Moderacion_Administrador
        FOREIGN KEY (administrador_id)
        REFERENCES seguridad.Usuario(id)
);
GO


/* ============================================================
   11. NOTIFICACIONES
   ============================================================ */

CREATE TABLE notificaciones.PreferenciaNotificacion (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    usuario_id          BIGINT NOT NULL,
    tipo_evento         VARCHAR(30) NOT NULL,
    canal               VARCHAR(20) NOT NULL,
    habilitado          BIT NOT NULL
                        CONSTRAINT DF_Preferencia_Habilitado DEFAULT (1),

    actualizado_en      DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Preferencia_Actualizado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_PreferenciaNotificacion PRIMARY KEY (id),

    CONSTRAINT UQ_Preferencia_Notificacion
        UNIQUE (usuario_id, tipo_evento, canal),

    CONSTRAINT CK_Preferencia_Evento CHECK (
        tipo_evento IN ('NUEVA_CONVOCATORIA', 'CAMBIO_ESTADO')
    ),

    CONSTRAINT CK_Preferencia_Canal CHECK (
        canal IN ('PORTAL', 'CORREO', 'WHATSAPP')
    ),

    CONSTRAINT FK_Preferencia_Usuario
        FOREIGN KEY (usuario_id)
        REFERENCES seguridad.Usuario(id)
);
GO

CREATE TABLE notificaciones.Notificacion (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    usuario_id          BIGINT NOT NULL,
    convocatoria_id     BIGINT NULL,
    postulacion_id      BIGINT NULL,

    tipo_evento         VARCHAR(30) NOT NULL,
    canal               VARCHAR(20) NOT NULL,

    titulo              NVARCHAR(180) NOT NULL,
    mensaje             NVARCHAR(MAX) NOT NULL,
    enlace              NVARCHAR(500) NULL,

    estado_envio        VARCHAR(20) NOT NULL
                        CONSTRAINT DF_Notificacion_Estado DEFAULT ('PENDIENTE'),

    enviada_en          DATETIME2(0) NULL,
    leida_en            DATETIME2(0) NULL,

    creada_en           DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Notificacion_Creada DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_Notificacion PRIMARY KEY (id),

    CONSTRAINT CK_Notificacion_Evento CHECK (
        tipo_evento IN (
            'NUEVA_CONVOCATORIA',
            'CAMBIO_ESTADO',
            'SISTEMA'
        )
    ),

    CONSTRAINT CK_Notificacion_Canal CHECK (
        canal IN ('PORTAL', 'CORREO', 'WHATSAPP')
    ),

    CONSTRAINT CK_Notificacion_EstadoEnvio CHECK (
        estado_envio IN ('PENDIENTE', 'ENVIADA', 'FALLIDA')
    ),

    CONSTRAINT FK_Notificacion_Usuario
        FOREIGN KEY (usuario_id)
        REFERENCES seguridad.Usuario(id),

    CONSTRAINT FK_Notificacion_Convocatoria
        FOREIGN KEY (convocatoria_id)
        REFERENCES convocatorias.Convocatoria(id),

    CONSTRAINT FK_Notificacion_Postulacion
        FOREIGN KEY (postulacion_id)
        REFERENCES postulaciones.Postulacion(id)
);
GO

CREATE INDEX IX_Notificacion_Usuario_Lectura
    ON notificaciones.Notificacion(usuario_id, leida_en, creada_en);
GO

CREATE INDEX IX_Notificacion_Envio
    ON notificaciones.Notificacion(estado_envio, creada_en);
GO


/* ============================================================
   12. AUDITORÍA
   ============================================================ */

CREATE TABLE seguridad.AuditoriaEvento (
    id                  BIGINT IDENTITY(1,1) NOT NULL,
    usuario_id          BIGINT NULL,
    tipo_evento         NVARCHAR(100) NOT NULL,
    entidad_tipo        NVARCHAR(80) NOT NULL,
    entidad_id          BIGINT NULL,

    es_acceso_sensible  BIT NOT NULL
                        CONSTRAINT DF_Auditoria_Sensible DEFAULT (0),

    detalle             NVARCHAR(MAX) NULL,
    direccion_ip        VARCHAR(45) NULL,
    user_agent          NVARCHAR(500) NULL,

    creado_en           DATETIME2(0) NOT NULL
                        CONSTRAINT DF_Auditoria_Creado DEFAULT (SYSDATETIME()),

    CONSTRAINT PK_AuditoriaEvento PRIMARY KEY (id),

    CONSTRAINT CK_Auditoria_Detalle_JSON CHECK (
        detalle IS NULL OR ISJSON(detalle) = 1
    ),

    CONSTRAINT FK_Auditoria_Usuario
        FOREIGN KEY (usuario_id)
        REFERENCES seguridad.Usuario(id)
);
GO

CREATE INDEX IX_Auditoria_Entidad
    ON seguridad.AuditoriaEvento(entidad_tipo, entidad_id, creado_en);
GO

CREATE INDEX IX_Auditoria_Sensible
    ON seguridad.AuditoriaEvento(es_acceso_sensible, creado_en);
GO


/* ============================================================
   RESUMEN DE ESQUEMAS
   ============================================================

   academico
      - Facultad
      - Carrera
      - PeriodoAcademico
      - MatriculaEstudiante

   institucional
      - Dependencia

   personas
      - Estudiante
      - Secretario

   seguridad
      - Usuario
      - TokenRestablecimiento
      - ConsentimientoDatos
      - AuditoriaEvento

   documentos
      - Archivo
      - DocumentoEstudiante

   convocatorias
      - Convocatoria
      - ConvocatoriaFacultad
      - ConvocatoriaCarrera
      - ConvocatoriaDocumentoRequerido
      - ModeracionConvocatoria

   postulaciones
      - Postulacion
      - PostulacionDocumento
      - HistorialEstadoPostulacion

   ia
      - AnonimizacionCV

   notificaciones
      - PreferenciaNotificacion
      - Notificacion


   ============================================================
   REGLAS PRINCIPALES DEL SISTEMA
   ============================================================

   1. Solo correos institucionales @unmsm.edu.pe.

   2. Un estudiante debe estar matriculado en el periodo académico
      correspondiente para poder postular.

   3. No se requiere Reporte de Matrícula:
      la condición de matrícula se almacena en academico.MatriculaEstudiante.

   4. El estudiante debe contar con un CV vigente.

   5. Cada estudiante solo puede postular una vez a una convocatoria.

   6. La postulación conserva exactamente el CV utilizado al momento
      de enviarse.

   7. El secretario no debe evaluar utilizando datos identificatorios
      del estudiante.

   8. La evaluación se realiza mediante codigo_anonimo y un CV anonimizado.

   9. La IA se usa exclusivamente para anonimización del CV,
      no para decidir quién es seleccionado o descartado.

   10. Si la anonimización falla o requiere revisión,
       el CV no debe habilitarse para evaluación.

   11. Los cierres automáticos, notificaciones y validaciones temporales
       corresponden principalmente al backend.

   12. Los indicadores del dashboard se calculan mediante consultas/vistas,
       evitando duplicar valores derivados en tablas.
*/