const express = require("express");
const router = express.Router();
const passport = require("../middlewares/googleStrategy");
const userController = require("../controllers/userController");

// Use controller functions for register and login
router.post("/register", userController.register);
router.post("/login", userController.login);

// Google OAuth routes remain here
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/oauth2callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
