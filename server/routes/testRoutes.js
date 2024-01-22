const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const { authenticate } = require("../middlewares/auth");

router.post("/create", authenticate, testController.createTest);
router.get("/all", authenticate, testController.getAllTests);
router.get("/company", authenticate, testController.getCompanyTests);
router.get("/:id", authenticate, testController.getTestById);
router.put("/:id", authenticate, testController.updateTestById);
router.delete("/:id", authenticate, testController.deleteTestById);

module.exports = router;
