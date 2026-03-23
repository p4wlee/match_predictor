// questo middleware va sempre usato dopo auth.js
// auth.js popola req.user con id e ruolo dell'utente autenticato
module.exports = (req, res, next) => {
  // controllo se il ruolo dell'utente è admin
  // req.user è stato popolato da auth.js con i dati del token
  if (req.user.role !== `admin`) {
    // se il ruolo non è admin rispondo con 403 (forbidden)
    return res.status(403).json({
      message: `forbidden: admin role required`,
    });
  }
  // se il ruolo è admin passo al controller
  next();
};
