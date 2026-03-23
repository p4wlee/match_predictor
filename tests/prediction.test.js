// importo chai per le asserzioni
const { expect } = require("chai");
// importo sinon per gli stub
const sinon = require("sinon");
// importo il controller da testare
const predictionController = require("../src/controllers/prediction.controller");
// importo il model per poterlo stubbarre
const predictionModel = require("../src/models/prediction.model");
// importo il model per poterlo stubbarre nel createPrediction
const matchModel = require("../src/models/match.model");

describe("match controller - createMatch", () => {
  // dopo ogni test ripristino tutti gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });
  // test con body vuoto quindi il controller deve rispondere con 400
  it("should return 400 if prediction not found", async () => {
    // simulo una richiesta con id partita, id utente e body vuoto
    const req = {
      params: { id: 1 }, // id della partita dall'URL
      user: { id: 1 }, // id dell'utente autenticato da auth.js
      body: {}, // body vuoto (manca prediction)
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // chiamo il controller
    await predictionController.createPrediction(req, res);

    // verifico che status sia stato chiamato con 400
    expect(res.status.calledWith(400)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `missing field` })).to.be.true;
  });

  // test con id partita inesistente quindi il controller deve rispondere con 404
  it("should return 404 if match not found", async () => {
    // simulo una richiesta con id partita inesistente, id utente e pronostico
    const req = {
      params: { id: 99 }, // id partita inesistente
      user: { id: 1 }, // dell'utente autenticato da auth.js
      body: { prediction: `1` }, // pronostico
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getMatchById per simulare una partita non esistente nel db
    sinon.stub(matchModel, "getMatchById").resolves(null);

    // chiamo il controller
    await predictionController.createPrediction(req, res);

    // verifico che status sia stato chiamato con 404
    expect(res.status.calledWith(404)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `match not found` })).to.be.true;
  });

  // test con pronostico già esistente quindi il controller deve rispondere con 409
  it("should return 409 if prediction already exists", async () => {
    // simulo una richiesta con id partita, id utente e pronostico
    const req = {
      params: { id: 2 },
      user: { id: 1 },
      body: { prediction: `1` },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getMatchById per simulare una partita esistente nel db
    sinon.stub(matchModel, "getMatchById").resolves({ id: 2, result: `1` });
    // stubbo findPrediction per simulare un pronostico già esistente nel db
    sinon.stub(predictionModel, "findPrediction").resolves({ id: 1, prediction: `1` });

    // chiamo il controller
    await predictionController.createPrediction(req, res);

    // verifico che status sia stato chiamato con 409
    expect(res.status.calledWith(409)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `prediction already exists` })).to.be.true;
  });

  // test con dati corretti quindi il controller deve rispondere con 201
  it("should return 201 if prediction is created successfully", async () => {
    // simulo una richiesta con id partita, id utente e pronostico
    const req = {
      params: { id: 1 },
      user: { id: 1 },
      body: { prediction: `1` },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getMatchById per simulare una partita esistente nel db
    sinon.stub(matchModel, "getMatchById").resolves({ id: 1, result: `1` });
    // stubbo findPrediction per simulare che non esiste ancora un pronostico nel db
    sinon.stub(predictionModel, "findPrediction").resolves(null);
    // stubbo createPrediction per simulare la creazione del pronostico nel db
    sinon.stub(predictionModel, "createPrediction").resolves(1);

    // chiamo il controller
    await predictionController.createPrediction(req, res);

    // verifico che status sia stato chiamato con 201
    expect(res.status.calledWith(201)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `prediction registered successfully` })).to.be.true;
  });

  // test con errore del database quindi il controller deve rispondere con 500
  it("should return 500 if database throws an error", async () => {
    // simulo una richiesta con id partita, id utente e pronostico
    const req = {
      params: { id: 1 },
      user: { id: 1 },
      body: { prediction: `1` },
    };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getMatchById per simulare un errore del database
    sinon.stub(matchModel, "getMatchById").rejects(new Error(`database error`));

    // chiamo il controller
    await predictionController.createPrediction(req, res);

    // verifico che status sia stato chiamato con 500
    expect(res.status.calledWith(500)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `internal server error` })).to.be.true;
  });
});

describe("prediction controller - getMyPredictions", () => {
  // dopo ogni test ripristino tutti gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test con nessun pronostico trovato quindi il controller deve rispondere con 404
  it("should return 404 if prediction not exists", async () => {
    // simulo una richiesta con id utente autenticato
    const req = { user: { id: 1 } };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getUserPredictions per simulare nessun pronostico nel db
    sinon.stub(predictionModel, "getUserPredictions").resolves([]);

    // chiamo il controller
    await predictionController.getMyPredictions(req, res);

    // verifico che status sia stato chiamato con 404
    expect(res.status.calledWith(404)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `no predictions found` })).to.be.true;
  });

  // test con pronostici esistenti quindi il controller deve rispondere con 200
  it("should return 200 if prediction exists", async () => {
    // simulo una richiesta con id utente autenticato
    const req = { user: { id: 1 } };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getUserPredictions per simulare pronostici esistenti nel db
    sinon.stub(predictionModel, "getUserPredictions").resolves([{ id: 1, prediction: `1` }]);

    // chiamo il controller
    await predictionController.getMyPredictions(req, res);

    // verifico che status sia stato chiamato con 200
    expect(res.status.calledWith(200)).to.be.true;
    // verifico che json sia stato chiamato una volta
    expect(res.json.calledOnce).to.be.true;
    // verifico che la risposta contenga predictions
    const response = res.json.firstCall.args[0];
    expect(response).to.have.property(`predictions`);
  });

  // test con errore del database quindi il controller deve rispondere con 500
  it("should return 500 if database throws an error", async () => {
    // simulo una richiesta con id utente autenticato
    const req = { user: { id: 1 } };
    // simulo la risposta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // stubbo getUserPredictions per simulare un errore del database
    sinon.stub(predictionModel, "getUserPredictions").rejects(new Error(`database error`));

    // chiamo il controller
    await predictionController.getMyPredictions(req, res);

    // verifico che status sia stato chiamato con 500
    expect(res.status.calledWith(500)).to.be.true;
    // verifico che json sia stato chiamato con il messaggio corretto
    expect(res.json.calledWith({ message: `internal server error` })).to.be.true;
  });
});
