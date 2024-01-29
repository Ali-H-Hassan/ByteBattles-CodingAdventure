const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Update the path to your app
const expect = chai.expect;
chai.use(chaiHttp);

describe("Get Random Challenge Endpoint", () => {
  it("should retrieve a random challenge and return a 200 status code", (done) => {
    chai
      .request(app)
      .get("/api/challenges/random") // Ensure this matches your route
      .end((err, res) => {
        if (err) {
          console.error("Error fetching random challenge:", err);
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("description");
        // Add more assertions based on the challenge structure
        done();
      });
  });
});
