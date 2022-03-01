const { make } = require("./Hash");

/**
 * generates a new token
 * @returns string generated token
 */
const generate = () => {
  return make(Math.random().toString());
};

module.exports = { generate };
