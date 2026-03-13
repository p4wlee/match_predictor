// importo bcrypt per hashare le password
const bcrypt = require("bcrypt");
// importo jsonwebtoken per generare e verificare i token
const jwt = require("jsonwebtoken");
// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();
// importo userModel per interagire con la tabella users nel database
const userModel = require("../models/user.model");

// registro un nuovo utente
exports.register = async (req, res) => {
  try {
    // leggo i dati dal body della richiesta
    const { username, email, password, role } = req.body;

    // verifico che tutti i campi siano presenti
    if (!username || !email || !password || !role)
      return res.status(400).json({
        message: `missing data`,
      });

    // verifico che l'username non sia già in uso
    const existingUsername = await userModel.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ message: `username already in use` });
    }

    // verifico che l'email non sia già in uso
    const existingEmail = await userModel.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: `email already in use` });
    }

    // hasho la password prima di salvarla nel database
    // bcrypt aggiunge un sale casuale e itera 10 volte per rendere l'hash sicuro
    const hashedPassword = await bcrypt.hash(password, 10);

    // creo il nuovo utente nel database con la password hashata
    await userModel.createUser(username, email, hashedPassword, role);

    // rispondo con 201 e un messaggio di successo
    return res.status(201).json({ message: `user registered successfully` });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({ message: `internal server error` });
  }
};

// autentico un utente e genero i token
exports.login = async (req, res) => {
  try {
    // leggo email e password dal body della richiesta
    const { email, password } = req.body;

    // verifico che tutti i campi siano presenti
    if (!email || !password)
      return res.status(400).json({
        message: `missing data`,
      });

    // cerco l'utente nel database tramite email
    // findByEmail restituisce undefined se l'utente non esiste
    const user = await userModel.findByEmail(email);

    // se l'utente non esiste rispondo con 404
    if (!user) return res.status(404).json({ message: `user not found` });

    // confronto la password in chiaro con quella hashata nel database
    // bcrypt.compare restituisce true se corrispondono, false altrimenti
    // non posso confrontare direttamente le stringhe perché la password nel db è hashata
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // se la password non è valida rispondo con 401
    if (!isPasswordValid) {
      return res.status(401).json({
        message: `unauthorized access`,
      });
    }

    // genero l'access token con id e ruolo dell'utente
    // questo token ha scadenza breve (1h) ed è usato per autenticare le richieste
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    // genero il refresh token con solo l'id dell'utente
    // questo token ha scadenza lunga (7d) ed è usato solo per ottenere un nuovo access token
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    // calcolo la data di scadenza del refresh token
    // Date.now() restituisce i millisecondi attuali, aggiungo 7 giorni in millisecondi
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // salvo il refresh token e la sua scadenza nel database
    // questo mi permette di invalidarlo al logout e verificarlo al refresh
    await userModel.updateRefreshToken(refreshToken, expiresAt, user.id);

    // rispondo con i due token
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({ message: `internal server error` });
  }
};

// genero un nuovo access token usando il refresh token
exports.refresh = async (req, res) => {
  try {
    // leggo il refresh token dal body della richiesta
    const { refreshToken } = req.body;

    // verifico che il refresh token sia presente nel body
    if (!refreshToken) {
      return res.status(400).json({
        message: `token not present`,
      });
    }

    // cerco l'utente nel database tramite il refresh token
    // findByRefreshToken restituisce undefined se il token non esiste nel db
    const user = await userModel.findByRefreshToken(refreshToken);

    // se nessun utente ha quel refresh token, il token non è valido
    if (!user) {
      return res.status(401).json({
        message: `user not found`,
      });
    }

    // verifico che il refresh token non sia scaduto
    // confronto la data di scadenza salvata nel db con la data attuale
    if (new Date(user.refresh_token_expires_at) < new Date()) {
      return res.status(401).json({
        message: `refresh token expired`,
      });
    }

    // genero un nuovo access token con id e ruolo dell'utente
    // uso il JWT_SECRET e la scadenza breve (1h) definiti nel .env
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    // rispondo con il nuovo access token
    return res.status(200).json({ accessToken });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};

// eseguo il logout dell'utente autenticato azzerando il refresh token nel database
exports.logout = async (req, res) => {
  try {
    // leggo l'id dell'utente da req.user, popolato dal middleware auth.js
    const userId = req.user.id;

    // azzero il refresh token e la sua scadenza nel database
    // questo invalida il token e impedisce di usarlo per generare nuovi access token
    await userModel.clearRefreshToken(userId);

    // rispondo con 200 e un messaggio di successo
    return res.status(200).json({
      message: `logout successful`,
    });
  } catch (error) {
    // gestisco qualsiasi errore imprevisto del server
    return res.status(500).json({
      message: `internal server error`,
    });
  }
};
