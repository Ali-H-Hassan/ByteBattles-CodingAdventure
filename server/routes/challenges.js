const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");
const { authenticate, authorize } = require("../middlewares/auth");

router.get(
  "/",
  authenticate,
  authorize("admin"),
  challengeController.getAllChallenges
);

router.get("/random", authenticate, challengeController.getRandomChallenge);

router.get("/:id", authenticate, challengeController.getChallengeById);

router.post(
  "/",
  authenticate,
  authorize("company"),
  challengeController.createTest
);

router.patch(
  "/:id",
  authenticate,
  authorize("company"),
  challengeController.updateChallenge
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  challengeController.deleteChallenge
);

module.exports = router;
