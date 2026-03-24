// importo il pool di connessione al database
const db = require("../config/db");

// cerco un utente per email e restituisco il primo risultato
exports.findByEmail = async (email) => {
  // uso il prepared statement con ? per prevenire sql injection
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  // restituisco il primo utente trovato, oppure undefined se non esiste
  return rows[0];
};

// cerco un utente per username e restituisco il primo risultato
exports.findByUsername = async (username) => {
  // uso il prepared statement con ? per prevenire sql injection
  const [rows] = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);
  // restituisco il primo utente trovato, oppure undefined se non esiste
  return rows[0];
};

// cerco un utente per id e restituisco il primo risultato
exports.findById = async (id) => {
  // uso il prepared statement con ? per prevenire sql injection
  const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
  // restituisco il primo utente trovato, oppure undefined se non esiste
  return rows[0];
};

// creo un nuovo utente e restituisco l'id appena generato dal database
exports.createUser = async (username, email, password, role) => {
  // inserisco il nuovo utente con i campi ricevuti come parametri
  const [result] = await db.query(`INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`, [username, email, password, role]);
  // restituisco l'id del nuovo utente appena creato
  return result.insertId;
};

// aggiorno il refresh token e la sua scadenza per un utente specifico
exports.updateRefreshToken = async (refreshToken, expiresAt, userId) => {
  // uso il prepared statement con ? per prevenire sql injection
  await db.query(`UPDATE users SET refresh_token = ?, refresh_token_expires_at = ? WHERE id = ?`, [refreshToken, expiresAt, userId]);
};

// azzero il refresh token e la sua scadenza per un utente specifico (logout)
exports.clearRefreshToken = async (userId) => {
  // imposto entrambi i campi a NULL per invalidare il refresh token
  await db.query(`UPDATE users SET refresh_token = NULL, refresh_token_expires_at = NULL WHERE id = ?`, [userId]);
};

// cerco un utente tramite il suo refresh token e restituisco il primo risultato
exports.findByRefreshToken = async (refreshToken) => {
  // uso il prepared statement con ? per prevenire sql injection
  const [rows] = await db.query(`SELECT * FROM users WHERE refresh_token = ?`, [refreshToken]);
  // restituisco il primo utente trovato, oppure undefined se non esiste
  return rows[0];
};
