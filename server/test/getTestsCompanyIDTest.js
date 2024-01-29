const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Get Tests by Company ID Endpoint", () => {
  it("should retrieve a list of tests for a specific company and return a 200 status code", (done) => {
    const companyId = "65a806310ad22968eb78b3f0";

    chai
      .request(app)
      .get(`/api/tests/company?companyId=${companyId}`)
      .end((err, res) => {
        if (err) {
          console.error("Error fetching tests by company ID:", err);
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});
