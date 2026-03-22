// importo chai per le asserzioni
const { expect } = require("chai");
// importo sinon per gli stub
const sinon = require("sinon");
// importo il controller da testare
const teamController = require("../src/controllers/team.controller");
// importo il model per poterlo stubbarre
const teamModel = require("../src/models/team.model");

describe("team controller - createTeam", () => {
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
    await teamController.createTeam(req, res);

    // verifico che status sia stato chiamato con 400
    expect(res.status.calledWith(400)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `missing field` })).to.be.true;
  });

  // test con dati corretti quindi il controller deve rispondere con 201
  it("should return 201 if team is created successfully", async () => {
    // simulo una richiesta con nome squadra nel body
    const req = {
      body: {
        name: `Roma`,
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo createTeam per simulare la creazione della squadra nel db
    sinon.stub(teamModel, "createTeam").resolves(1);

    // chiamo il controller
    await teamController.createTeam(req, res);

    // verifico che status sia stato chiamato con 201
    expect(res.status.calledWith(201)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `team registered successfully` })).to.be.true;
  });

  // test con errore del database quindi il controller deve rispondere con 500
  it("should return 500 if database throws an error", async () => {
    // simulo una richiesta con nome squadra nel body
    const req = {
      body: {
        name: `Roma`,
      },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo createTeam per simulare un errore del database
    sinon.stub(teamModel, "createTeam").rejects(new Error(`database error`));

    // chiamo il controller
    await teamController.createTeam(req, res);

    // verifico che status sia stato chiamato con 500
    expect(res.status.calledWith(500)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `internal server error` })).to.be.true;
  });
});

describe("team controller - getTeams", () => {
  // dopo ogni test ripristino tutti gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test con lista squadre quindi il controller deve rispondere con 200
  it("should return 200 if teams are found", async () => {
    // simulo una richiesta senza parametri
    const req = {};
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo showTeams per simulare la lista delle squadre nel db
    sinon.stub(teamModel, "showTeams").resolves([{ id: 1, name: `Roma` }]);

    // chiamo il controller
    await teamController.getTeams(req, res);

    // verifico che status sia stato chiamato con 200
    expect(res.status.calledWith(200)).to.be.true;
    // verifico che json sia stato chiamato una volta
    expect(res.json.calledOnce).to.be.true;
    // verifico che la risposta contenga teams
    const response = res.json.firstCall.args[0];
    expect(response).to.have.property(`teams`);
  });

  // test con errore del database quindi il controller deve rispondere con 500
  it("should return 500 if database throws an error", async () => {
    // simulo una richiesta senza parametri
    const req = {};
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo showTeams per simulare un errore del database
    sinon.stub(teamModel, "showTeams").rejects(new Error(`database error`));

    // chiamo il controller
    await teamController.getTeams(req, res);

    // verifico che status sia stato chiamato con 500
    expect(res.status.calledWith(500)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `internal server error` })).to.be.true;
  });
});
