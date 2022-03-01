const { make } = require('./Hash');

/**
 *  get a uuid
 * @returns {string} returns a portion of uuid v4
 */
module.exports = () => make(Math.random().toString(), 'md5').substr(0,16);