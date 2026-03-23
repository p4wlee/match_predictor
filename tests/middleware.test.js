// importo chai per le asserzioni
const { expect } = require("chai");
// importo sinon per gli stub
const sinon = require("sinon");
// importo il middleware di autenticazione da testare
const authMiddleware = require("../src/middleware/auth");
// importo il middleware di autorizzazione admin da testare
const isAdminMiddleware = require("../src/middleware/isAdmin");

describe("middleware - auth", () => {
  // dopo ogni test ripristino tutti gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test con headers vuoti quindi il middleware deve rispondere con 401
  it("should return 401 if token is missing", async () => {
    // simulo una richiesta con headers vuoti
    const req = { headers: {} };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    // creo lo stub di next()
    const next = sinon.stub();

    // chiamo il middleware
    await authMiddleware(req, res, next);

    // verifico che status sia stato chiamato con 401
    expect(res.status.calledWith(401)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `missing or malformed token` })).to.be.true;
  });

  // test con token malformato quindi il middleware deve rispondere con 401
  it("should return 401 if token is malformed", async () => {
    // simulo una richiesta con token senza prefisso Bearer
    const req = { headers: { authorization: `invalidtoken` } };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    // creo lo stub di next()
    const next = sinon.stub();

    // chiamo il middleware
    await authMiddleware(req, res, next);

    // verifico che status sia stato chiamato con 401
    expect(res.status.calledWith(401)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `missing or malformed token` })).to.be.true;
  });

  // test con token non valido o scaduto quindi il middleware deve rispondere con 401
  it("should return 401 if token is not valid", async () => {
    // simulo una richiesta con token non valido
    const req = { headers: { authorization: `Bearer invalidtoken` } };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    // creo lo stub di next()
    const next = sinon.stub();

    // chiamo il middleware
    await authMiddleware(req, res, next);

    // verifico che status sia stato chiamato con 401
    expect(res.status.calledWith(401)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `invalid or expired token` })).to.be.true;
  });

  // test con token valido quindi il middleware deve chiamare next()
  it("should call next if token is valid", async () => {
    // importo jwt per generare un token valido
    const jwt = require("jsonwebtoken");
    // genero un token JWT valido usando il segreto dal .env
    const validToken = jwt.sign({ id: 1, role: `user` }, process.env.JWT_SECRET);

    // simulo una richiesta con token valido nell'header
    const req = { headers: { authorization: `Bearer ${validToken}` } };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    // creo lo stub di next()
    const next = sinon.stub();

    // chiamo il middleware
    await authMiddleware(req, res, next);

    // verifico che next sia stato chiamato una volta (token valido)
    expect(next.calledOnce).to.be.true;
    // verifico che req.user sia stato popolato con id e ruolo
    expect(req.user).to.have.property(`id`, 1);
    expect(req.user).to.have.property(`role`, `user`);
  });
});

describe("middleware - isAdmin", () => {
  afterEach(() => {
    sinon.restore();
  });
});
