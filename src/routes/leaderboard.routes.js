// importo express per creare il router
const express = require("express");
const router = express.Router();

// importo il controller per la gestione della classifica
const leaderboardController = require("../controllers/leaderboard.controller");

// route pubblica per ottenere la classifica generale con filtri opzionali
// es. /leaderboard?week=3&sort=asc
router.get("/", leaderboardController.getLeaderboard);

// esporto il router per montarlo in app.js
module.exports = router;
