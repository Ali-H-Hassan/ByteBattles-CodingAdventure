const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Update the path to your app
const expect = chai.expect;
chai.use(chaiHttp);

describe("Get Courses Endpoint", () => {
  it("should retrieve a list of courses and return a 200 status code", (done) => {
    chai
      .request(app)
      .get("/api/games/courses")
      .end((err, res) => {
        if (err) {
          console.error("Error fetching courses:", err);
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        if (res.body.length > 0) {
          expect(res.body[0]).to.have.property("title");
          expect(res.body[0]).to.have.property("description");
          expect(res.body[0]).to.have.property("difficulty");
        }
        done();
      });
  });
});
