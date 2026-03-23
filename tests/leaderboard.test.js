// importo chai per le asserzioni
const { expect } = require("chai");
// importo sinon per gli stub
const sinon = require("sinon");
// importo il controller da testare
const leaderboardController = require("../src/controllers/leaderboard.controller");
// importo il model per poterlo stubbarre
const leaderboardModel = require("../src/models/leaderboard.model");

describe("prediction controller - getUserPredictions", () => {
  // dopo ogni test ripristino tutti gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test con pronostici esistenti quindi il controller deve rispondere con 200
  it("should return 200 if prediction exists", async () => {
    // simulo una richiesta con filtro week e filtro asc
    const req = { query: { week: `1`, sort: `asc` } };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getLeaderboard per simulare pronostici esistenti nel db
    sinon.stub(leaderboardModel, "getLeaderboard").resolves([{ week: 1, sort: `asc` }]);

    // chiamo il controller
    await leaderboardController.getLeaderboard(req, res);

    // verifico che status sia stato chiamato con 200
    expect(res.status.calledWith(200)).to.be.true;
    // verifico che json sia stato chiamato una volta
    expect(res.json.calledOnce).to.be.true;
    // verifico che la risposta contenga leaderboard
    const response = res.json.firstCall.args[0];
    expect(response).to.have.property(`leaderboard`);
  });

  // test con errore del database quindi il controller deve rispondere con 500
  it("should return 500 if database throws an error", async () => {
    // simulo una richiesta con id utente autenticato
    const req = { query: { week: `1`, sort: `asc` } };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getLeaderboard per simulare un errore del database
    sinon.stub(leaderboardModel, "getLeaderboard").rejects(new Error(`database error`));

    // chiamo il controller
    await leaderboardController.getLeaderboard(req, res);

    // verifico che status sia stato chiamato con 500
    expect(res.status.calledWith(500)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `internal server error` })).to.be.true;
  });
});
