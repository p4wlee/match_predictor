// importo il pool di connessione al database
const db = require("../config/db");

// creo una nuova partita e restituisco l'id appena generato dal database
exports.createMatch = async (weekId, homeTeamId, awayTeamId, result) => {
  // inserisco la nuova partita con i campi ricevuti come parametri
  const [queryResult] = await db.query(`INSERT INTO matches (week_id, home_team_id, away_team_id, result) VALUES (?, ?, ?, ?)`, [weekId, homeTeamId, awayTeamId, result]);
  // restituisco l'id della nuova partita appena creata
  return queryResult.insertId;
};

// recupero tutte le partite con filtro opzionale per settimana
exports.getMatches = async (weekId) => {
  // se weekId è presente filtro per settimana, altrimenti restituisco tutto
  if (weekId) {
    const [result] = await db.query(`SELECT * FROM matches WHERE week_id = ?`, [weekId]);
    return result;
  } else {
    const [result] = await db.query(`SELECT * FROM matches`);
    return result;
  }
};

// recupero il dettaglio di una singola partita con i nomi delle squadre
exports.getMatchById = async (matchId) => {
  // uso due JOIN sulla tabella teams con alias diversi per distinguere casa e trasferta
  const [rows] = await db.query(
    `SELECT 
      matches.id,
      matches.result,
      home.name AS home_team,
      away.name AS away_team
    FROM matches
    JOIN teams AS home ON matches.home_team_id = home.id
    JOIN teams AS away ON matches.away_team_id = away.id
    WHERE matches.id = ?`,
    [matchId],
  );
  // restituisco la singola partita trovata, oppure undefined se non esiste
  return rows[0];
};
