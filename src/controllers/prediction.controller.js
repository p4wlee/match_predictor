// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();
// importo predictionModel per interagire con la tabella predictions nel database
const predictionModel = require("../models/prediction.model");
// importo matchModel per interagire con la tabella matches nel database
const matchModel = require("../models/match.model");

// inserisco un nuovo pronostico per una partita specifica
exports.createPrediction = async (req, res) => {
  try {
    // leggo l'id della partita dall'url (es. /matches/5/predict)
    const matchId = req.params.id;
    // leggo l'id dell'utente autenticato da req.user, popolato dal middleware auth.js
    const userId = req.user.id;
    // leggo il pronostico dal body della richiesta ('1', 'X' o '2')
    const { prediction } = req.body;

    // verifico che il campo prediction sia presente
    if (!prediction) {
      return res.status(400).json({
        message: `missing field`,
      });
    }

    // cerco la partita nel database per verificare che esista e ottenere il risultato ufficiale
    const match = await matchModel.getMatchById(matchId);

    // se la partita non esiste rispondo con 404
    if (!match) {
      return res.status(404).json({
        message: `match not found`,
      });
    }

    // verifico che l'utente non abbia già inserito un pronostico per questa partita
    // il vincolo UNIQUE nel db lo bloccherebbe comunque, ma è meglio gestirlo prima con un 409
    const existingPrediction = await predictionModel.findPrediction(userId, matchId);
    if (existingPrediction) {
      return res.status(409).json({
        message: `prediction already exists`,
      });
    }

    // calcolo i punti confrontando il pronostico dell'utente con il risultato ufficiale
    // se coincidono assegno 3 punti, altrimenti 0
    let pointsAwarded = 0;
    if (prediction === match.result) {
      pointsAwarded = 3;
    }

    // salvo il pronostico nel database con i punti già calcolati
    await predictionModel.createPrediction(userId, matchId, prediction, pointsAwarded);

    // rispondo con 201 e un messaggio di successo
    return res.status(201).json({
      message: `prediction registered successfully`,
    });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};

// restituisco i pronostici dell'utente autenticato
exports.getMyPredictions = async (req, res) => {
  try {
    // leggo l'id dell'utente autenticato da req.user, popolato dal middleware auth.js
    const userId = req.user.id;

    // recupero tutti i pronostici dell'utente dal database
    const predictions = await predictionModel.getUserPredictions(userId);

    // se non ci sono pronostici rispondo con 404
    if (predictions.length === 0) {
      return res.status(404).json({
        message: `no predictions found`,
      });
    }

    // rispondo con 200 e la lista dei pronostici
    return res.status(200).json({ predictions });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};

// restituisco i pronostici di un utente specifico tramite id
exports.getUserPredictions = async (req, res) => {
  try {
    // leggo l'id dell'utente dall'url (es. /users/5/predictions)
    const userId = req.params.id;

    // recupero tutti i pronostici dell'utente dal database
    const predictions = await predictionModel.getUserPredictions(userId);

    // se non ci sono pronostici rispondo con 404
    if (predictions.length === 0) {
      return res.status(404).json({
        message: `no predictions found`,
      });
    }

    // rispondo con 200 e la lista dei pronostici
    return res.status(200).json({ predictions });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};
