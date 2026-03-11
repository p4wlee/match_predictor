// importo il pool di connessione al database
const db = require("../config/db");

// recupero la classifica generale con filtri opzionali per settimana e ordinamento
exports.getLeaderboard = async (weekId, sort) => {
  // costruisco la query base con le funzioni di aggregazione
  // group by raggruppa i risultati per utente, così i calcoli vengono fatti per ogni utente

  // COUNT(*) conta quante righe esistono in quel gruppo
  // ma dato che raggruppiamo per utente, conta quante predictions ha quell'utente

  // SUM(colonna) somma tutti i valori di una colonna per quel gruppo
  // SUM(points_awarded) somma tutti i punti di un utente (es. 3+3+0+3, restituisce 9)

  // CASE WHEN points_awarded = 3 THEN 1 ELSE 0 END restituisce 1 se il pronostico è corretto, 0 altrimenti
  // combinato con SUM conta quante volte la condizione è vera
  let sql = `
    SELECT
      users.username,
      COUNT(*) AS total_bets,
      SUM(predictions.points_awarded) AS total_points,
      SUM(CASE WHEN predictions.points_awarded = 3 THEN 1 ELSE 0 END) AS correct_predictions,
      SUM(CASE WHEN predictions.points_awarded = 0 THEN 1 ELSE 0 END) AS wrong_predictions,
      ROUND((SUM(CASE WHEN predictions.points_awarded = 3 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS accuracy
    FROM predictions
    JOIN users ON predictions.user_id = users.id
    JOIN matches ON predictions.match_id = matches.id
    JOIN weeks ON matches.week_id = weeks.id
  `;

  // creo l'array dei parametri e lo popolo solo se weekId è presente
  const params = [];

  // aggiungo il filtro per settimana solo se weekId è presente
  if (weekId) {
    sql += ` WHERE weeks.week_number = ?`;
    params.push(weekId);
  }

  // raggruppo per utente così le funzioni di aggregazione lavorano per ogni utente
  sql += ` GROUP BY users.id, users.username`;

  // ordino per punti totali, ascendente o discendente in base al parametro sort
  // se sort non è specificato uso DESC come default
  sql += ` ORDER BY total_points ${sort === "asc" ? "ASC" : "DESC"}`;

  // eseguo la query con i parametri costruiti dinamicamente
  const [rows] = await db.query(sql, params);

  // restituisco tutti gli utenti con i loro dati aggregati
  return rows;
};
