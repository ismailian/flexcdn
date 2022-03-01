const Database = require("../helpers/Database");
const { Model, DataTypes } = require("sequelize");
const uuid = require("../helpers/Uuid");

/**
 * Folder model
 */
class Folder extends Model {
  
  /**
   * checks if user owns this folder
   * @param {*} folderId
   * @param {*} userId
   */
  static async hasOwnership(folderId, userId) {
    return await Folder.findOne({
      attributes: ["id"],
      where: { user_id: userId, uuid: folderId },
    }) ? true : false;
  }
}

Folder.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, field: "user_id" },
    driveId: { type: DataTypes.INTEGER, field: "drive_id" },
    name: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  { sequelize: Database, modelName: "folder" }
);

module.exports = Folder;
