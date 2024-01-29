const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Create Test Endpoint", () => {
  it("should create a new test and return a 201 status code", (done) => {
    const testDetails = {
      title: "Sample Test",
      mcqQuestions: [
        {
          questionText: "What is 2 + 2?",
          options: [
            { text: "3", isCorrect: false },
            { text: "4", isCorrect: true },
            { text: "5", isCorrect: false },
          ],
        },
      ],
      programmingQuestion: {
        questionText: "Write a function to add two numbers.",
        starterCode: "function add(a, b) {\n  // your code here\n}",
        testCases: [
          { input: "1, 2", output: "3" },
          { input: "10, -5", output: "5" },
        ],
      },
      createdBy: "65a806310ad22968eb78b3f0",
    };

    chai
      .request(app)
      .post("/api/tests/create")
      .send(testDetails)
      .end((err, res) => {
        if (err) {
          console.error("Error creating test:", err);
          return done(err);
        }

        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id");
        expect(res.body.title).to.equal(testDetails.title);
        done();
      });
  });
});
