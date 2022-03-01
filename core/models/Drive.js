const Database = require("../helpers/Database");
const { Model, DataTypes } = require("sequelize");
const uuid = require("../helpers/Uuid");

/**
 * Drive model
 */
class Drive extends Model {

  /**
   * checks if user owns this drive
   * @param {*} driveId
   * @param {*} userId
   * @returns
   */
  static async hasOwnership(driveId, userId) {
    return (await Drive.findOne({
      attributes: ["id"],
      where: { user_id: userId, uuid: driveId },
    }))
      ? true
      : false;
  }
}

Drive.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, field: "user_id" },
    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  { sequelize: Database, modelName: "drive" }
);

module.exports = Drive;
