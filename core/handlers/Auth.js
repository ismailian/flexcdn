const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Token = require("../models/Token");
const { generate } = require("../helpers/Token");
const { make } = require("../helpers/Hash");

/**
 * express Router
 */
const AuthHandler = express.Router();

/**
 * POST /login
 *
 * perform a login attempt and respond with result.
 */
AuthHandler.post(
  "/login",

  body("username").isString(),
  body("password").isString(),

  async (req, res) => {
    const { username, password } = req.body;

    /** validate username/password */
    if (!username || !password) {
      res.status(400).json({
        status: false,
        message: `[username] and [password] are required!`,
      });
    }

    /** login */
    const login = await User.findOne({
      where: {
        username,
        password: make(password),
        activated: true,
      },
    });

    /** */
    if (!login) {
      return res.status(401).json({
        status: false,
        message: "Username/Password is incorrect.",
      });
    }

    // generate new token and save to db.
    const createdToken = await Token.create({
      user_id: login.id,
      token: generate(),
    });

    res.status(200).json({
      status: true,
      token: createdToken.token,
      message: "You are successfully logged in!",
    });
  }
);

/**
 * POST /revoke
 *
 * perform a token revoke and return result.
 */
AuthHandler.post("/revoke", async (req, res) => {
  const isDeleted = await Token.destroy({
    where: {
      id: req.auth.id,
    },
  });

  res.status(200).json({
    status: isDeleted ? true : false,
    message: isDeleted
      ? "Your token has been revoked."
      : "Failed to revoke token.",
  });
});

module.exports = AuthHandler;
