const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("User Feature Tests", () => {
  describe("User Registration", () => {
    it("should register a new user and return user object with token", (done) => {
      chai
        .request(app)
        .post("/users/register")
        .send({
          username: "testuser",
          email: "testuser@example.com",
          password: "TestPassword123",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("token");
          expect(res.body.user).to.have.property("username", "testuser");
          done();
        });
    });
  });
});
