// importo chai per le asserzioni
const { expect } = require("chai");
// importo sinon per gli stub
const sinon = require("sinon");
// importo il controller da testare
const userController = require("../src/controllers/user.controller");
// importo il model per poterlo stubbarre
const userModel = require("../src/models/user.model");

describe("user controller - get Me", () => {
  // dopo ogni test ripristino tutti gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test con utente non esistente quindi il controller deve rispondere con 404
  it("should return 404 if user not found", async () => {
    // simulo una richiesta con id utente non esiste
    const req = {
      user: {
        id: 99,
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo findById per simulare un utente non esistente nel db
    sinon.stub(userModel, "findById").resolves(null);

    // chiamo il controller
    await userController.getMe(req, res);

    // verifico che status sia stato chiamato con 404
    expect(res.status.calledWith(404)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `user not found` })).to.be.true;
  });

  // test con id esistente quindi il controller deve rispondere con 200
  it("should return 200 if user is found", async () => {
    // simulo una richiesta con id utente esistente
    const req = {
      user: {
        id: 1,
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    // stubbo findById per simulare un utente esistente nel db
    sinon.stub(userModel, "findById").resolves({ id: 1 });

    // chiamo il controller
    await userController.getMe(req, res);

    // verifico che status sia stato chiamato con 200
    expect(res.status.calledWith(200)).to.be.true;
    // verifico che json sia stato chiamato una volta
    expect(res.json.calledOnce).to.be.true;
    // verifico che la risposta contenga id
    const response = res.json.firstCall.args[0];
    expect(response).to.have.property(`publicData`);
  });
  // test con errore del database quindi il controller deve rispondere con 500
  it("should return 500 if database throws an error", async () => {
    // simulo una richiesta con id esistente
    const req = {
      user: {
        id: 1,
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo findById per simulare un errore del database
    sinon.stub(userModel, "findById").rejects(new Error(`database error`));

    // chiamo il controller
    await userController.getMe(req, res);

    // verifico che status sia stato chiamato con 500
    expect(res.status.calledWith(500)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `internal server error` })).to.be.true;
  });
});

describe("user controller - getUserById", () => {
  // dopo ogni test ripristino tutti gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test con utente non esistente quindi il controller deve rispondere con 404
  it("should return 404 if user not found", async () => {
    // simulo una richiesta con id utente non esiste
    const req = {
      params: {
        id: 99,
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo findById per simulare un utente non esistente nel db
    sinon.stub(userModel, "findById").resolves(null);

    // chiamo il controller
    await userController.getUserById(req, res);

    // verifico che status sia stato chiamato con 404
    expect(res.status.calledWith(404)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `user not found` })).to.be.true;
  });

  // test con id esistente quindi il controller deve rispondere con 200
  it("should return 200 if user is found", async () => {
    // simulo una richiesta con id utente esistente
    const req = {
      params: {
        id: 1,
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    // stubbo findById per simulare un utente esistente nel db
    sinon.stub(userModel, "findById").resolves({ id: 1 });

    // chiamo il controller
    await userController.getUserById(req, res);

    // verifico che status sia stato chiamato con 200
    expect(res.status.calledWith(200)).to.be.true;
    // verifico che json sia stato chiamato una volta
    expect(res.json.calledOnce).to.be.true;
    // verifico che la risposta contenga id
    const response = res.json.firstCall.args[0];
    expect(response).to.have.property(`publicData`);
  });
  // test con errore del database quindi il controller deve rispondere con 500
  it("should return 500 if database throws an error", async () => {
    // simulo una richiesta con id esistente
    const req = {
      params: {
        id: 1,
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo findById per simulare un errore del database
    sinon.stub(userModel, "findById").rejects(new Error(`database error`));

    // chiamo il controller
    await userController.getUserById(req, res);

    // verifico che status sia stato chiamato con 500
    expect(res.status.calledWith(500)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `internal server error` })).to.be.true;
  });
});
