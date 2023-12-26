const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById, (req, res) =>
  res.json(res.user)
);
router.put("/:id", userController.getUserById, userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
