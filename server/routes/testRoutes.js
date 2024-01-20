const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.post("/create", testController.createTest);

router.get("/all", testController.getAllTests);

router.get("/:id", testController.getTestById);

router.put("/:id", testController.updateTestById);

router.delete("/:id", testController.deleteTestById);

module.exports = router;
