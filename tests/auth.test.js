// importo chai per le asserzioni
const { expect } = require("chai");
// importo sinon per gli stub
const sinon = require("sinon");
// importo il controller da testare
const authController = require("../src/controllers/auth.controller");
// importo il model per poterlo stubbarre
const userModel = require("../src/models/user.model");
// importo bcrypt per stubbarne i metodi usati nel controller
const bcrypt = require("bcrypt");

describe("auth controller - register", () => {
  // dopo ogni test ripristino tutti gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test con body vuoto quindi il controller deve rispondere con 400
  it("should return 400 if data is missing", async () => {
    // simulo una richiesta con body vuoto
    const req = { body: {} };

    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // chiamo il controller
    await authController.register(req, res);

    // verifico che status sia stato chiamato con 400
    expect(res.status.calledWith(400)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `missing data` })).to.be.true;
  });

  // test con username già esistente quindi il controller deve rispondere con 409
  it("should return 409 if username already exists", async () => {
    // simulo una richiesta con body vuoto
    const req = {
      body: {
        username: "user1",
        email: "email.prova@test.it",
        password: "password1",
        role: "user",
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo findByUsername per simulare un username già esistente nel db
    sinon.stub(userModel, "findByUsername").resolves({ id: 1, username: "user1" });

    // chiamo il controller
    await authController.register(req, res);

    // verifico che status sia stato chiamato con 409
    expect(res.status.calledWith(409)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `username already in use` })).to.be.true;
  });

  // test con email già esistente quindi il controller deve rispondere con 409
  it("should return 409 if email already exists", async () => {
    // simulo una richiesta con body vuoto
    const req = {
      body: {
        username: "user1",
        email: "email.prova@test.it",
        password: "password1",
        role: "user",
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo findByUsername per simulare username non esistente
    sinon.stub(userModel, "findByUsername").resolves(null);
    // stubbo findByEmail per simulare un'email già esistente nel db
    sinon.stub(userModel, "findByEmail").resolves({ id: 1, email: "email.prova@test.it" });

    // chiamo il controller
    await authController.register(req, res);

    // verifico che status sia stato chiamato con 409
    expect(res.status.calledWith(409)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `email already in use` })).to.be.true;
  });

  // test con tutti i dati corretti quindi il controller deve rispondere con 201
  it("should return 201 if registration was successful", async () => {
    // simulo una richiesta con body vuoto
    const req = {
      body: {
        username: "user1",
        email: "email.prova@test.it",
        password: "password1",
        role: "user",
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo findByUsername e findByEmail per simulare dati non esistenti nel db
    sinon.stub(userModel, "findByUsername").resolves(null);
    sinon.stub(userModel, "findByEmail").resolves(null);
    // stubbo createUser per simulare la creazione dell'utente nel db
    sinon.stub(userModel, "createUser").resolves(1);
    // stubbo bcrypt.hash per evitare che esegua l'hash reale durante il test
    sinon.stub(bcrypt, "hash").resolves(`hashedPassword123`);

    // chiamo il controller
    await authController.register(req, res);

    // verifico che status sia stato chiamato con 201
    expect(res.status.calledWith(201)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `user registered successfully` })).to.be.true;
  });
});
