const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Run Battle Endpoint", () => {
  it("should process the user's code and return battle results", (done) => {
    const battleDetails = {
      userId: "65a9ceb139fc17bf0de542ad",
      challengeId: "65b235cc0ad22968eb78b484",
      userCode: "function testCode() { return true; }",
      language: "JavaScript",
    };

    chai
      .request(app)
      .post("/api/battle/run")
      .send(battleDetails)
      .end((err, res) => {
        if (err) {
          console.error("Error running battle:", err);
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("winner");
        expect(res.body).to.have.property("userResults");
        expect(res.body).to.have.property("aiResults");
        expect(res.body).to.have.property("aiFeedback");
        done();
      });
  }).timeout(10000);
});
