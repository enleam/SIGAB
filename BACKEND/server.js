const express = require("express");
const cors = require("cors");

require("dotenv").config();

const {
    getConnection,
} = require("./config/db");

const {
    validarVariablesEntorno,
} = require("./config/env");

const apiRoutes = require("./routes");

const {
    rutaNoEncontrada,
} = require("./middlewares/notFound.middleware");

const {
    manejarError,
} = require("./middlewares/error.middleware");


const app = express();

const PORT =
    process.env.PORT || 3000;


/* ============================================================
   VALIDACION DE VARIABLES DE ENTORNO
   ============================================================ */

validarVariablesEntorno();


/* ============================================================
   CORS
   ============================================================ */

app.use(
    cors({
        origin:
            process.env.FRONTEND_URL,

        exposedHeaders: [
            "X-Access-Token",
        ],
    })
);


/* ============================================================
   BODY PARSER
   ============================================================ */

app.use(
    express.json()
);


/* ============================================================
   RUTAS DE LA API
   ============================================================ */

app.use(
    "/api",
    apiRoutes
);


/* ============================================================
   RUTA NO ENCONTRADA
   ============================================================ */

app.use(
    rutaNoEncontrada
);


/* ============================================================
   MANEJO GLOBAL DE ERRORES
   ============================================================ */

app.use(
    manejarError
);


/* ============================================================
   INICIO DEL SERVIDOR
   ============================================================ */

async function iniciarServidor() {
    try {
        await getConnection();

        app.listen(
            PORT,
            () => {
                console.log(
                    `Servidor SIGAB ejecutandose en puerto ${PORT}`
                );
            }
        );
    } catch (error) {
        console.error(
            "No se pudo iniciar el servidor:",
            error
        );

        process.exit(1);
    }
}


iniciarServidor();