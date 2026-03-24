// importo teamModel per interagire con la tabella teams nel database
const teamModel = require("../models/team.model");

// creo una nuova squadra (solo admin)
exports.createTeam = async (req, res) => {
  try {
    // leggo il nome della squadra dal body della richiesta
    const { name } = req.body;

    // verifico che il campo name sia presente
    if (!name) {
      return res.status(400).json({
        message: `missing field`,
      });
    }

    // creo la nuova squadra nel database
    await teamModel.createTeam(name);

    // rispondo con 201 e un messaggio di successo
    return res.status(201).json({
      message: `team registered successfully`,
    });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};

// restituisco la lista di tutte le squadre
exports.getTeams = async (req, res) => {
  try {
    // recupero tutte le squadre dal database
    const teams = await teamModel.showTeams();

    // rispondo con 200 e la lista delle squadre
    return res.status(200).json({ teams });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};
