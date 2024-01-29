const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();

router.post("/", async function (req, res) {
  const redirectUrl = "http://localhost:3000/auth/google/callback";
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
  );

  const authorizedUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });

  res.json({ url: authorizedUrl });
});

module.exports = router;
