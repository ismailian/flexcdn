const { Sequelize } = require("sequelize");

/**
 * new database connection
 */
const { DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_DRIVER } = process.env;
const connection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DRIVER /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  logging: false /** disable logging */,
  query: {
    raw: true /** disable object mappings */,
    nest: true,
  },
});

module.exports = connection;
