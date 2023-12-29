const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // Ensure node-fetch is installed
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  console.log("data", data);
  return data; // Return user data
}

// Google OAuth Callback Route
router.get("/auth/google/callback", async function (req, res) {
  const code = req.query.code;
  const redirectUrl = "http://localhost:3000/auth/google/callback"; // Make sure this matches your Google Cloud Console settings
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
  );

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const userData = await getUserData(tokens.access_token);
    console.log("User Data:", userData);

    // Here, you can use userData to create or update a user in your database
    // Then, handle the session or token creation for the user and respond or redirect as needed

    // Example: Redirect to home page after successful authentication
    res.redirect("/");
  } catch (err) {
    console.error("Error with signing in with Google:", err);
    res.status(500).send("Authentication failed");
  }
});

module.exports = router;
