const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");

router.get("/", challengeController.getAllChallenges);
router.get("/:id", challengeController.getChallengeById, (req, res) =>
  res.json(res.challenge)
);
router.post("/", challengeController.createChallenge);
router.patch(
  "/:id",
  challengeController.getChallengeById,
  challengeController.updateChallenge
);
router.delete("/:id", challengeController.deleteChallenge);

module.exports = router;
