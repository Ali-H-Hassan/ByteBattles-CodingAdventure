const express = require("express");
const router = express.Router();
const battleController = require("../controllers/battleController");

router.post("/run", battleController.runBattle);

module.exports = router;
