const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Submit Score Endpoint", () => {
  it("should update the user's high score and return a 200 status code", (done) => {
    const scoreDetails = {
      userId: "65a9ceb139fc17bf0de542ad",
      score: 100,
    };

    chai
      .request(app)
      .post("/api/games/submit-score")
      .send(scoreDetails)
      .end((err, res) => {
        if (err) {
          console.error("Error submitting score:", err);
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("highScore", 100);
        done();
      });
  });
});
