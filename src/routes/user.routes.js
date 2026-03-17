// importo express per creare il router
const express = require("express");
const router = express.Router();

// importo il controller per la gestione degli utenti
const userController = require("../controllers/user.controller");

// importo il middleware di autenticazione per proteggere le route private
const auth = require("../middleware/auth");

// route protetta per ottenere i dati dell'utente autenticato
router.get("/me", auth, userController.getMe);

// route pubblica per ottenere i dati pubblici di un utente tramite id
router.get("/:id", userController.getUserById);

// esporto il router per montarlo in app.js
module.exports = router;
