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
