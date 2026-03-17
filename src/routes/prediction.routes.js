// importo express per creare il router
const express = require("express");
const router = express.Router();

// importo il controller per la gestione dei pronostici
const predictionController = require("../controllers/prediction.controller");

// importo il middleware di autenticazione per proteggere le route private
const auth = require("../middleware/auth");

// route protetta per inserire un pronostico su una partita specifica
// l':id è l'id della partita, montata su /matches diventa /matches/:id/predict
router.post("/:id/predict", auth, predictionController.createPrediction);

// route protetta per ottenere i pronostici dell'utente autenticato
// montata su /users diventa /users/me/predictions
router.get("/me/predictions", auth, predictionController.getMyPredictions);

// route pubblica per ottenere i pronostici di un utente specifico tramite id
// montata su /users diventa /users/:id/predictions
router.get("/:id/predictions", predictionController.getUserPredictions);

// esporto il router per montarlo in app.js
module.exports = router;
