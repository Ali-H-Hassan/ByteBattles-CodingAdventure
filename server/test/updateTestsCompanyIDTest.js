const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Update Test by ID Endpoint", () => {
  it("should update a test and return the updated test with a 200 status code", (done) => {
    const testId = "65b7245412a38c6b6797de96";
    const updatedTestData = {
      title: "Updated Test Title",
    };

    chai
      .request(app)
      .put(`/api/tests/${testId}`)
      .send(updatedTestData)
      .end((err, res) => {
        if (err) {
          console.error("Error updating test:", err);
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id", testId);
        expect(res.body).to.have.property("title", "Updated Test Title");
        done();
      });
  });
});
