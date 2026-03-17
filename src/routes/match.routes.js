// importo express per creare il router
const express = require("express");
const router = express.Router();

// importo il controller per la gestione delle partite
const matchController = require("../controllers/match.controller");

// importo i middleware di autenticazione e autorizzazione admin
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// route protetta per la creazione di una nuova partita (solo admin)
// auth verifica il token, isAdmin verifica il ruolo
router.post("/", auth, isAdmin, matchController.createMatch);

// route pubblica per ottenere la lista di tutte le partite con filtro opzionale per settimana
// es. /matches?week=3
router.get("/", matchController.getAllMatches);

// route pubblica per ottenere il dettaglio di una singola partita tramite id
// es. /matches/5
router.get("/:id", matchController.getMatchById);

// esporto il router per montarlo in app.js
module.exports = router;
