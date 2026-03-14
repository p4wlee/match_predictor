// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();
// importo weekModel per interagire con la tabella weeks nel database
const weekModel = require("../models/week.model");

// creo una nuova settimana (solo admin)
exports.createWeek = async (req, res) => {
  try {
    // leggo il numero della settimana dal body della richiesta
    const { weekNumber } = req.body;

    // verifico che il campo weekNumber sia presente
    if (!weekNumber) {
      return res.status(400).json({
        message: `missing field`,
      });
    }

    // creo la nuova settimana nel database
    await weekModel.createWeek(weekNumber);

    // rispondo con 201 e un messaggio di successo
    return res.status(201).json({
      message: `week registered successfully`,
    });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};

// restituisco la lista delle settimane
exports.getWeeks = async (req, res) => {
  try {
    // recupero tutte le settimane dal database
    const weeks = await weekModel.showWeeks();

    // rispondo con 200 e la lista delle settimane
    return res.status(200).json({ weeks });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};
