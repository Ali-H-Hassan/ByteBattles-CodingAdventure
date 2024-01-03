const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.get("/courses", gameController.getCourses);

// Add other routes as needed

module.exports = router;
