// importo express per creare il router
const express = require("express");
const router = express.Router();

// importo il controller per la gestione dell'autenticazione
const authController = require("../controllers/auth.controller");

// importo il middleware di autenticazione per proteggere il logout
const auth = require("../middleware/auth");

// route pubblica per la registrazione di un nuovo utente
router.post("/register", authController.register);

// route pubblica per il login, restituisce access token e refresh token
router.post("/login", authController.login);

// route pubblica per ottenere un nuovo access token tramite refresh token
router.post("/refresh", authController.refresh);

// route protetta per il logout, richiede un utente autenticato
router.post("/logout", auth, authController.logout);

// esporto il router per montarlo in app.js
module.exports = router;
