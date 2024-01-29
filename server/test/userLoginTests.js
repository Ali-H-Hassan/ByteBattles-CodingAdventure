const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);
describe("User Login Tests", () => {
  it("should log in an existing user and return a token", (done) => {
    const validCredentials = {
      email: "updatedEmail@example.com",
      password: "1234",
    };
    chai
      .request(app)
      .post("/users/login")
      .send(validCredentials)
      .end((err, res) => {
        if (err) {
          console.error("Error during login:", err);
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.user).to.have.property("token");
        done();
      });
  });
});
