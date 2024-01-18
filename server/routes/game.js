const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.get("/courses", gameController.getCourses);

router.post("/submit-score", gameController.submitScore);

module.exports = router;
