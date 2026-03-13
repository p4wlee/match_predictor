// importo bcrypt per hashare le password
const bcrypt = require("bcrypt");
// importo jsonwebtoken per generare e verificare i token
const jwt = require("jsonwebtoken");
// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();
// importo userModel per interagire con la tabella users nel database
const userModel = require("../models/user.model");

// restituisco i dati dell'utente autenticato escludendo i campi sensibili
exports.getMe = async (req, res) => {
  try {
    // leggo l'id dell'utente da req.user, popolato dal middleware auth.js
    const userId = req.user.id;

    // cerco l'utente nel database tramite id
    const user = await userModel.findById(userId);

    // se l'utente non esiste rispondo con 404
    if (!user) {
      return res.status(404).json({
        message: `user not found`,
      });
    }

    // escludo i campi sensibili dalla risposta
    // password e refresh token non devono mai essere mandati al client
    const { password, refresh_token, refresh_token_expires_at, ...publicData } = user;

    // rispondo con i dati pubblici dell'utente
    return res.status(200).json({ publicData });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};
