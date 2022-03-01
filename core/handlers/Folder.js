const express = require("express");
const Drive = require("../models/Drive");
const Folder = require("../models/Folder");
const { param, body, validationResult } = require("express-validator");
const uuid = require('../helpers/Uuid');

/**
 * express Router
 */
const FolderHandler = express.Router();

/**
 * GET /folders
 * get a list of owned folders.
 */
FolderHandler.get("/", async (req, res) => {
  const folders = await Folder.findAll({
    attributes: ["uuid", "name"],
    where: { user_id: req.auth.user_id },
  });

  res.status(200).json({
    status: true,
    folders,
  });
});

/**
 * POST /folders
 * create a new folder
 */
FolderHandler.post(
  "/",

  body("drive").matches(/^([0-9a-fA-F]{16})$/),
  body("name").matches(/^[\w\s]+$/),

  async (req, res) => {
    /** get errors if any */
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ status: false, errors });
    }

    /** body params */
    const { drive, name } = req.body;

    /** check drive ownership */
    const isDriveOwned = await Drive.hasOwnership(drive, req.auth.user_id);
    if (!isDriveOwned) {
      return res.status(401).json({
        status: false,
        message: "You don't have permission to access this drive",
      });
    }

    /** create folder */
    const folder = await Folder.create({
      uuid: uuid(),
      userId: req.auth.user_id,
      driveId: drive,
      name,
    });

    res.status(200).json({ status: true, folder });
  }
);

/**
 * DELETE /folders
 * deletes an owned folder
 */
FolderHandler.delete(
  "/:folder",

  param("folder").matches(/^([0-9a-fA-F]{16})$/),

  async (req, res) => {
    /** get errors if any */
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ status: false, errors });
    }

    const { folder } = req.params;
    const isDeleted = await Folder.destroy({
      where: { uuid: folder, user_id: req.auth.user_id },
    });

    res.status(200).json({
      status: isDeleted ? true : false,
      message: isDeleted
        ? `Folder has been deleted.`
        : "Failed to delete folder.",
    });
  }
);

module.exports = FolderHandler;
