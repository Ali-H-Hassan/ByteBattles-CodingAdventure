const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // Ensure node-fetch is installed
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);
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
  console.log("Hit the /auth/google/callback route");
  console.log("Query Parameters:", req.query);
  const code = req.query.code;
  if (!code) {
    console.log("No code in the query parameter");
    return res.status(400).send("No code provided");
  }

  try {
    // Correctly call getToken on the instance of OAuth2Client
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const userData = await getUserData(tokens.access_token);
    console.log("User Data:", userData);

    // ... rest of the route handler ...
  } catch (err) {
    console.error("Error with signing in with Google:", err);
    res.status(500).send("Authentication failed");
  }
});

module.exports = router;
