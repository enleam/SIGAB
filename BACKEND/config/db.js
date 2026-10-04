const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise = null;

const crearPool = async () => {
  const pool = new sql.ConnectionPool(dbConfig);

  pool.on("error", (error) => {
    console.error(
      "Error en el pool de SQL Server:",
      error.message
    );

    poolPromise = null;
  });

  await pool.connect();

  console.log("Conexión a SQL Server establecida");

  return pool;
};

const getConnection = async () => {
  try {
    if (!poolPromise) {
      poolPromise = crearPool();
    }

    return await poolPromise;
  } catch (error) {
    poolPromise = null;

    console.error(
      "Error al conectar con SQL Server:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  sql,
  getConnection,
};