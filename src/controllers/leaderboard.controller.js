// importo leaderboardModel per interagire con la classifica nel database
const leaderboardModel = require("../models/leaderboard.model");

// restituisco la classifica generale con filtri opzionali per settimana e ordinamento
exports.getLeaderboard = async (req, res) => {
  try {
    // leggo i parametri opzionali dalla query string
    const { week, sort } = req.query;

    // recupero la classifica dal database passando i filtri opzionali
    // se week e sort non sono presenti, il model restituisce la classifica completa ordinata per punti DESC
    const leaderboard = await leaderboardModel.getLeaderboard(week, sort);

    // rispondo con 200 e la classifica
    return res.status(200).json({ leaderboard });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};
