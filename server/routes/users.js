const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/auth");
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", authenticate, authorize("admin"), userController.getAllUsers);
router.get("/:id", authenticate, userController.getUserById);
router.put("/:id", authenticate, authorize("admin"), userController.updateUser);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.deleteUser
);
router.post(
  "/admin/create-company",
  authenticate,
  authorize("admin"),
  userController.createCompanyUser
);
router.post(
  "/company/create-challenge",
  authenticate,
  authorize("company"),
  userController.createChallenge
);

module.exports = router;
