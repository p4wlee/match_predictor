// importo il pool di connessione al database
const db = require("../config/db");

// creo una nuova settimana e restituisco l'id appena generato dal database
exports.createWeek = async (weekNumber) => {
  // inserisco la nuova settimana con i campi ricevuti come parametri
  const [result] = await db.query(`INSERT INTO weeks (week_number) VALUES (?)`, [weekNumber]);
  // restituisco l'id della nuova settimana appena creata
  return result.insertId;
};

// recupero la lista di tutte le settimane
exports.showWeeks = async () => {
  // query per estrapolare numero settimana e id delle settimane dalla tabella weeks
  const [rows] = await db.query("SELECT * FROM weeks");
  return rows;
};
