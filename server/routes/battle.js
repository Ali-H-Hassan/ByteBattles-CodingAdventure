const express = require("express");
const router = express.Router();
const battleController = require("../controllers/battleController");

router.post("/run", battleController.runBattle);

router.get("/results", battleController.getBattleResults);

module.exports = router;
