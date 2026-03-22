// importo chai per le asserzioni
const { expect } = require("chai");
// importo sinon per gli stub
const sinon = require("sinon");
// importo il controller da testare
const matchController = require("../src/controllers/match.controller");
// importo il model per poterlo stubbarre
const matchModel = require("../src/models/match.model");

describe("match controller - createMatch", () => {
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
    await matchController.createMatch(req, res);

    // verifico che status sia stato chiamato con 400
    expect(res.status.calledWith(400)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `missing field` })).to.be.true;
  });

  // test con home team e away team uguali quindi il controller deve rispondere con 400
  it("should return 400 if home team and away team are the same", async () => {
    // simulo body completo con home team id e away team id uguali
    const req = {
      body: {
        weekId: 1,
        homeTeamId: 2,
        awayTeamId: 2,
        result: "X",
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // chiamo il controller
    await matchController.createMatch(req, res);

    // verifico che status sia stato chiamato con 400
    expect(res.status.calledWith(400)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `home team and away team cannot be the same` })).to.be.true;
  });

  // test con dati corretti quindi il controller deve rispondere con 201
  it("should return 201 if match is created successfully", async () => {
    // simulo una richiesta con body completo
    const req = {
      body: {
        weekId: 3,
        homeTeamId: 1,
        awayTeamId: 2,
        result: "X",
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo createMatch per simulare la creazione del match nel db
    sinon.stub(matchModel, "createMatch").resolves(1);

    // chiamo il controller
    await matchController.createMatch(req, res);

    // verifico che status sia stato chiamato con 201
    expect(res.status.calledWith(201)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `match registered successfully` })).to.be.true;
  });

  // test con errore del database quindi il controller deve rispondere con 500
  it("should return 500 if database throws an error", async () => {
    // simulo una richiesta con nome squadra nel body
    const req = {
      body: {
        weekId: 3,
        homeTeamId: 1,
        awayTeamId: 2,
        result: "X",
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo createMatch per simulare un errore del database
    sinon.stub(matchModel, "createMatch").rejects(new Error(`database error`));

    // chiamo il controller
    await matchController.createMatch(req, res);

    // verifico che status sia stato chiamato con 500
    expect(res.status.calledWith(500)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `internal server error` })).to.be.true;
  });
});
