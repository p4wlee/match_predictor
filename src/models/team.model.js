// importo il pool di connessione al database
const db = require("../config/db");

// creo una nuova squadra e restituisco l'id appena generato dal database
exports.createTeam = async (name) => {
  // inserisco la nuova squadra con i campi ricevuti come parametri
  const [result] = await db.query(`INSERT INTO teams (name) VALUES (?)`, [name]);
  // restituisco l'id della nuova squadra appena creata
  return result.insertId;
};

// recupero la lista di tutte le squadre
exports.showTeams = async () => {
  // query per estrapolare nome e id delle squadre dalla tabella teams
  const [rows] = await db.query("SELECT * FROM teams");
  return rows;
};
