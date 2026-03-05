// importo mysql2/promise per avere supporto nativo ad async/await
const mysql = require("mysql2/promise");

// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();

// creo un pool di connessioni al database
// un pool gestisce più connessioni contemporaneamente in modo efficiente
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// esporto il pool direttamente, già pronto per async/await
module.exports = pool;
