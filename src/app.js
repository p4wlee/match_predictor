// importo Express per creare il server
const express = require("express");

// creo l'applicazione Express
const app = express();

// aggiungo il middleware per parsare il body delle richieste in formato JSON
app.use(express.json());

// importo tutte le routes
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/user.routes");
const weeksRoutes = require("./routes/week.routes");
const teamsRoutes = require("./routes/team.routes");
const matchesRoutes = require("./routes/match.routes");
const predictionsRoutes = require("./routes/prediction.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");

// monto le routes sui path corretti
// auth: registrazione, login, refresh e logout
app.use("/auth", authRoutes);

// users: dati utente autenticato e dati pubblici di un utente
app.use("/users", usersRoutes);

// predictions montate su /users per GET /users/me/predictions e GET /users/:id/predictions
app.use("/users", predictionsRoutes);

// weeks: creazione e lista settimane
app.use("/weeks", weeksRoutes);

// teams: creazione e lista squadre
app.use("/teams", teamsRoutes);

// matches: creazione, lista e dettaglio partite
app.use("/matches", matchesRoutes);

// predictions montate su /matches per POST /matches/:id/predict
app.use("/matches", predictionsRoutes);

// leaderboard: classifica generale con filtri opzionali
app.use("/leaderboard", leaderboardRoutes);

// esporto l'app senza avviarla, così server.js può avviarla
// e i test possono importarla senza avviare il server
module.exports = app;
