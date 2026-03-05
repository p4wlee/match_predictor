// importo Express per creare il server
const express = require("express");

// creo l'applicazione Express
const app = express();

// aggiungo il middleware per parsare il body delle richieste in formato JSON
app.use(express.json());

// esporto l'app senza avviarla, così server.js può avviarla
// e i test possono importarla senza avviare il server
module.exports = app;
