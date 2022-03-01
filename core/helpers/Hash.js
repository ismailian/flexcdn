const { createHmac } = require("crypto");

/**
 * generate a hash
 *
 * @param {*} input the text to hash.
 */
const make = (input, algo = 'sha256') => createHmac(algo, input).digest("hex");

/**
 * verify hash
 *
 * @param {*} hash the hash to check against.
 * @param {*} input the text to check.
 */
const verify = (hash, input, algo = 'sha256') => {
  return hash === createHmac("sha256", input).digest("hex");
};

module.exports = { make, verify };
