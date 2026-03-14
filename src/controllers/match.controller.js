// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();
// importo matchModel per interagire con la tabella matches nel database
const matchModel = require("../models/match.model");

// creo una nuova partita (solo admin)
exports.createMatch = async (req, res) => {
  try {
    // leggo i campi necessari dal body della richiesta
    const { weekId, homeTeamId, awayTeamId, result } = req.body;

    // verifico che tutti i campi siano presenti
    if (!weekId || !homeTeamId || !awayTeamId || !result) {
      return res.status(400).json({
        message: `missing field`,
      });
    }

    // verifico che la squadra di casa e quella in trasferta non siano uguali
    if (homeTeamId === awayTeamId) {
      return res.status(400).json({
        message: `home team and away team cannot be the same`,
      });
    }

    // creo la partita nel database
    await matchModel.createMatch(weekId, homeTeamId, awayTeamId, result);

    // rispondo con 201 e un messaggio di successo
    return res.status(201).json({
      message: `match registered successfully`,
    });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};

// restituisco la lista di tutte le partite con filtro opzionale per settimana
exports.getAllMatches = async (req, res) => {
  try {
    // leggo il parametro week dalla query string (es. /matches?week=3)
    // se non è presente, week sarà undefined e il model restituirà tutte le partite
    const { week } = req.query;

    // recupero le partite dal database, passando il filtro opzionale
    const matches = await matchModel.getMatches(week);

    // rispondo con 200 e la lista delle partite
    return res.status(200).json({ matches });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};

// restituisco il dettaglio di una singola partita tramite id
exports.getMatchById = async (req, res) => {
  try {
    // leggo l'id della partita dall'url (es. /matches/5)
    const matchId = req.params.id;

    // cerco la partita nel database tramite id
    const match = await matchModel.getMatchById(matchId);

    // se la partita non esiste rispondo con 404
    if (!match) {
      return res.status(404).json({
        message: `match not found`,
      });
    }

    // rispondo con 200 e il dettaglio della partita
    return res.status(200).json({ match });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};
