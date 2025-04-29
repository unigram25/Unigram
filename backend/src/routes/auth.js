const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

const axios = require("axios");

authRouter.get("/connect/github", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = "http://127.0.0.1:3000/auth/github/callback";
  const state = "secureRandomState"; // add proper CSRF protection in prod

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${state}`;

  res.redirect(githubAuthUrl);
});

authRouter.get("/auth/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for token
    const tokenRes = await axios.post("https://github.com/login/oauth/access_token", {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: { Accept: "application/json" }
    });

    const accessToken = tokenRes.data.access_token;

    // Fetch user profile
    const githubUser = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json"
      }
    });

    // Optionally fetch emails
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const primaryEmail = emailRes.data.find(e => e.primary).email;

    // Get current user (from cookie/session/JWT)
    const token = req.cookies.token;
    const userId = verifyJWT(token); // You must implement `verifyJWT` to extract the user ID

    // Update user record
    await User.findByIdAndUpdate(userId, {
      github: {
        id: githubUser.data.id,
        username: githubUser.data.login,
        avatarUrl: githubUser.data.avatar_url,
        email: primaryEmail
      }
    });

    res.send("GitHub account linked successfully");
  } catch (err) {
    res.status(500).send("GitHub OAuth failed: " + err.message);
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email");
    }
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User loggged out");
});
module.exports = { authRouter };
