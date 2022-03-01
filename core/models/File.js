const Database = require("../helpers/Database");
const { Model, DataTypes } = require("sequelize");
const uuid = require("../helpers/Uuid");

/**
 * User model
 */
class File extends Model {

  /**
   * checks if user owns this file.
   * @param {*} fileId
   * @param {*} userId
   */
  static async hasOwnership(fileId, userId) {
    return (await File.findOne({
      attributes: ["id"],
      where: { user_id: userId, uuid: fileId },
    }))
      ? true
      : false;
  }
}

File.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, field: "user_id" },
    driveId: { type: DataTypes.INTEGER, field: "drive_id" },
    folderId: { type: DataTypes.INTEGER, field: "folder_id" },
    filename: DataTypes.STRING,
    type: DataTypes.STRING,
    size: DataTypes.INTEGER,
    hash: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  { sequelize: Database, modelName: "file" }
);

module.exports = File;
