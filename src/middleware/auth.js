// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();
// importo jsonwebtoken per verificare il token
const jwt = require("jsonwebtoken");

// esporto il middleware di autenticazione
// questo middleware va applicato a tutte le route che richiedono un utente autenticato
module.exports = (req, res, next) => {
  // leggo l'header Authorization dalla richiesta
  // il client deve inviare il token in questo formato: "Bearer il_token_qui"
  const authHeader = req.headers.authorization;

  // se l'header non esiste o non inizia con "Bearer" rispondo con 401
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      error: "missing or malformed token",
    });
  }

  // estraggo il token dalla stringa "Bearer il_token_qui"
  // split(" ") divide la stringa in ["Bearer", "il_token_qui"] e prendo il secondo elemento
  const token = authHeader.split(" ")[1];

  try {
    // verifico il token con il segreto dal .env
    // se il token non è valido o scaduto, jwt.verify lancia un errore automaticamente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // salvo il payload decodificato in req.user
    // così tutti i controller successivi sanno chi sta facendo la richiesta (id e ruolo)
    req.user = decoded;

    // chiamo next() per passare al controller
    next();
  } catch (error) {
    // se jwt.verify lancia un errore il token non è valido o è scaduto
    return res.status(401).json({
      error: "invalid or expired token",
    });
  }
};
