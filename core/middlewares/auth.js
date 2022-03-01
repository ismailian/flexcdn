const Token = require("../models/Token");

/**
 * Checks for authorization header
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const auth = async (req, res, next) => {
  const urls = ["/api/v1/auth/login"];
  if (urls.includes(req.url)) {
    return next();
  }

  const authHeader = req.headers.authorization || null;

  if (
    !authHeader ||
    !authHeader.match(/^[Bb]earer\s(?<token>[0-9A-Fa-f]{64})$/)
  ) {
    return res.status(401).json({
      status: false,
      message: "You need an API token to access this resource.",
    });
  }

  /** grab auth token */
  const token = authHeader.match(/^[Bb]earer\s(?<token>[0-9A-Fa-f]{64})$/)
    .groups.token;

  /** grab user id */
  const tokenEntry = await Token.findOne({
    attributes: ["id", "user_id", "token"],
    where: { token },
  });

  /** return not authorized */
  if (!tokenEntry) {
    return res.status(401).json({
      status: false,
      message: "Token is not valid",
    });
  }

  /** add token to request */
  req.auth = {
    id: tokenEntry.id,
    user_id: tokenEntry.user_id,
    token: tokenEntry.token,
  };

  /** forward request */
  next();
};

module.exports = auth;
