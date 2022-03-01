const express = require("express");
const Drive = require("../models/Drive");
const { param, body, validationResult } = require("express-validator");
const uuid = require('../helpers/Uuid');

/**
 * express Router
 */
const DriveHandler = express.Router();

/**
 * GET /drives
 * returns a list of owned drives
 */
DriveHandler.get("/", async (req, res) => {
  const drives = await Drive.findAll({
    attributes: ["uuid", "name"],
    where: {
      user_id: req.auth.user_id,
    },
  });

  res.status(200).json({
    status: true,
    drives,
  });
});

/**
 * POST /drives
 * creates a new drive
 */
DriveHandler.post(
  "/",

  body("name").matches(/^[\w\s]+$/),

  async (req, res) => {
    /** get errors if any */
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ status: false, errors });
    }

    const { name } = req.body;
    const drive = await Drive.create({
      uuid: uuid(),
      userId: req.auth.user_id,
      name,
    });

    res.status(200).json({
      status: true,
      drive,
    });
  }
);

/**
 * DELETE /drives
 * deletes an owned drive
 */
DriveHandler.delete(
  "/:drive",

  param("drive").matches(/^([0-9a-fA-F]{16})$/),

  async (req, res) => {
    /** get errors if any */
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ status: false, errors });
    }

    const { drive } = req.params;
    const isDeleted = await Drive.destroy({
      where: {
        uuid: drive,
        user_id: req.auth.user_id,
      },
    });

    res.status(200).json({
      status: isDeleted ? true : false,
      message: isDeleted
        ? `Drive has been deleted.`
        : "Failed to delete drive.",
    });
  }
);

module.exports = DriveHandler;
