// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();

// importo il pool di connessione al database
const db = require("./src/config/db");

// testo la connessione al database
async function testConnection() {
  try {
    // eseguo una query semplice per verificare che la connessione funzioni
    const [rows] = await db.query("SELECT 1");
    console.log("connessione al database riuscita");
  } catch (error) {
    console.error("errore di connessione al database:", error.message);
  }
}

testConnection();
