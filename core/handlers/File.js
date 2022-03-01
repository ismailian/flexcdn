const express = require("express");
const path = require("path");
const Drive = require("../models/Drive");
const Folder = require("../models/Folder");
const File = require("../models/File");
const { param, body, validationResult } = require("express-validator");
const uuid = require('../helpers/Uuid');

/**
 * express Router
 */
const FileHandler = express.Router();

/**
 * GET /files
 * get a list of owned files.
 */
FileHandler.get("/", async (req, res) => {
  const files = await File.findAll({ where: { user_id: req.auth.user_id } });
  res.status(200).json({ status: true, files });
});

/**
 * POST /files
 * creates a new file
 */
FileHandler.post(
  "/",

  body("drive").matches(/^([0-9a-fA-F]{16})$/),
  body("folder").matches(/^([0-9a-fA-F]{16})$/),

  async (req, res) => {
    /** validate params */
    const errors = validationResult(req).array();
    const { payload } = req.files || {};
    if (!payload) {
      errors.push({
        value: null,
        msg: "Invalid payload",
        param: "payload",
        location: "files"
      });
    }

    /** return errors if any */
    if (errors.length > 0) {
      return res.status(400).json({ status: false, errors });
    }

    const { drive, folder } = req.body;

    /** check drive ownership */
    const isDriveOwned = await Drive.hasOwnership(drive, req.auth.user_id);
    if (!isDriveOwned) {
      return res.status(401).json({
        status: false,
        message: "You don't have permission to access to this drive.",
      });
    }

    /** check folder ownership */
    const isFolderOwned = await Folder.hasOwnership(folder, req.auth.user_id);
    if (!isFolderOwned) {
      return res.status(401).json({
        status: false,
        message: "You don't have permission to access to this folder.",
      });
    }

    /** move file to storage */
    payload.mv(path.join(process.cwd(), "storage", payload.md5));

    const file = await File.create({
      uuid: uuid(),
      userId: req.auth.user_id,
      driveId: drive,
      folderId: folder,
      filename: payload.name,
      type: payload.mimetype,
      size: payload.size,
      hash: payload.md5,
    });

    res.status(200).json({ status: true, file });
  }
);

/**
 * DELETE /files
 *
 * deletes an owned file.
 */
FileHandler.delete(
  "/:file",

  param("file").matches(/^([0-9a-fA-F]{16})$/),

  async (req, res) => {
    /** validate params */
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ status: false, errors });
    }

    const { file } = req.params;
    const isDeleted = await File.destroy({
      where: { uuid: file, user_id: req.auth.user_id },
    });

    res.status(200).json({
      status: isDeleted ? true : false,
      message: isDeleted
        ? `Folder has been deleted.`
        : "Failed to delete file.",
    });
  }
);

module.exports = FileHandler;
