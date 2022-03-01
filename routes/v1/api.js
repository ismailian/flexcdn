const express = require("express");

/**
 * express Router
 */
const Router = express.Router();

/**
 * map to auth handler
 */
Router.use("/auth", require("../../core/handlers/Auth"));

/**
 * map to profile handler
 */
Router.use("/profile", require("../../core/handlers/Profile"));

/**
 * map to drive handler
 */
Router.use("/drives", require("../../core/handlers/Drive"));

/**
 * map to folder handler
 */
Router.use("/folders", require("../../core/handlers/Folder"));

/**
 * map to file handler
 */
Router.use("/files", require("../../core/handlers/File"));

module.exports = Router;
