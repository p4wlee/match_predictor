// importo express per creare il router
const express = require("express");
const router = express.Router();

// importo il controller per la gestione delle settimane
const weekController = require("../controllers/week.controller");

// importo i middleware di autenticazione e autorizzazione admin
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// route protetta per la creazione di una nuova settimana (solo admin)
// auth verifica il token, isAdmin verifica il ruolo
router.post("/", auth, isAdmin, weekController.createWeek);

// route pubblica per ottenere la lista di tutte le settimane
router.get("/", weekController.getWeeks);

// esporto il router per montarlo in app.js
module.exports = router;
