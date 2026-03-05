// importo dotenv per leggere le variabili dal file .env
require("dotenv").config();

// importo l'app Express configurata in app.js
const app = require("./src/app");

// leggo la porta dal file .env
const PORT = process.env.PORT || 3000;

// avvio il server sulla porta definita
app.listen(PORT, () => {
  console.log(`server avviato sulla porta ${PORT}`);
});
