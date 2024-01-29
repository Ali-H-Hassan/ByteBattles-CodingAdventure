const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Update Profile Endpoint", () => {
  it("should update the user profile and return a 200 status code", (done) => {
    chai
      .request(app)
      .post("/api/profile/update")
      .set(
        "Authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWE5Y2ViMTM5ZmMxN2JmMGRlNTQyYWQiLCJ1c2VyVHlwZSI6ImluZGl2aWR1YWwiLCJpYXQiOjE3MDY0OTg0NzEsImV4cCI6MTcwNjU4NDg3MX0.HKzQ71PuKHeWUWcC2uTxjIaF9abMlU-0GbUX5lsLgCk"
      )
      .field("username", "updatedUsername")
      .field("email", "updatedEmail@example.com")
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id");
        done();
      });
  });
});
