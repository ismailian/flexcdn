const { Model, DataTypes } = require("sequelize");
const Database = require("../helpers/Database");

/**
 * User model
 */
class Token extends Model {

  /**
   * revoke a token
   */
  static async revoke(userId, token) {
    return await Token.destroy({
      where: { user_id: userId, token }
    });
  }

}

Token.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  { sequelize: Database, modelName: "token" }
);

module.exports = Token;
