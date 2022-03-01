const { Model, DataTypes } = require("sequelize");
const Database = require("../helpers/Database");

/**
 * User model
 */
class User extends Model {

  /**
   * checks if user is activated
   * @param {string} userId the user id to check.
   */
  static async isActivated(userId) {
    return await User.findOne({
      attributes: ['id', 'activated'],
      where: {
        id: userId,
        activated: true,
      }
    }) ? true : false;
  }

}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: DataTypes.STRING,
    fullname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    activated: DataTypes.BOOLEAN,
    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  { sequelize: Database, modelName: "user" }
);

module.exports = User;
