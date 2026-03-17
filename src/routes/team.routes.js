// importo express per creare il router
const express = require("express");
const router = express.Router();

// importo il controller per la gestione delle squadre
const teamController = require("../controllers/team.controller");

// importo i middleware di autenticazione e autorizzazione admin
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// route protetta per la creazione di una nuova squadra (solo admin)
// auth verifica il token, isAdmin verifica il ruolo
router.post("/", auth, isAdmin, teamController.createTeam);

// route pubblica per ottenere la lista di tutte le squadre
router.get("/", teamController.getTeams);

// esporto il router per montarlo in app.js
module.exports = router;
