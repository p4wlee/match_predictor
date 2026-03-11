// importo il pool di connessione al database
const db = require("../config/db");

// verifico se esiste già un pronostico per una coppia utente/partita
exports.findPrediction = async (userId, matchId) => {
  // cerco nella tabella predictions la combinazione unica user_id + match_id
  const [rows] = await db.query(`SELECT * FROM predictions WHERE user_id = ? AND match_id = ?`, [userId, matchId]);
  // restituisco il pronostico trovato, oppure undefined se non esiste
  return rows[0];
};

// inserisco un nuovo pronostico con i punti già calcolati
exports.createPrediction = async (userId, matchId, prediction, pointsAwarded) => {
  // inserisco il pronostico con tutti i campi ricevuti come parametri
  const [result] = await db.query(`INSERT INTO predictions (user_id, match_id, prediction, points_awarded) VALUES (?, ?, ?, ?)`, [userId, matchId, prediction, pointsAwarded]);
  // restituisco l'id del pronostico appena creato
  return result.insertId;
};

// recupero tutti i pronostici di un utente specifico con i dettagli delle partite
exports.getUserPredictions = async (userId) => {
  // uso più JOIN per ottenere i dettagli completi di ogni pronostico
  // join con matches per il risultato ufficiale
  // join con teams (due volte) per i nomi delle squadre
  // join con weeks per il numero della settimana
  const [rows] = await db.query(
    `SELECT
      weeks.week_number, 
      home.name AS home_team, 
      away.name AS away_team, 
      predictions.prediction, 
      matches.result, 
      predictions.points_awarded
    FROM predictions
    JOIN matches ON predictions.match_id = matches.id
    JOIN teams AS home ON matches.home_team_id = home.id
    JOIN teams AS away ON matches.away_team_id = away.id
    JOIN weeks ON matches.week_id = weeks.id
    WHERE predictions.user_id = ?`,
    [userId],
  );
  // restituisco tutti i pronostici trovati
  return rows;
};
