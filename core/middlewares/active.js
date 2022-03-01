const User = require('../models/User');
const Token = require('../models/Token');

/**
 * checks if the account is activated
 * @param {} req
 * @param {} res
 * @param {} next
 */ 
const active = async (req, res, next) => {

	const urls = ["/api/v1/auth/login"];
	if (urls.includes(req.url)) {
	    return next();
  	}

  	const isActivated = await User.isActivated(req.auth.user_id); 
	if (!isActivated) {
		if (req.auth) {
			await Token.revoke(req.auth.user_id, req.auth.token);
			req.auth.token = '';
		}
		
		return res.status(401).json({ 
			status: false, message: 'Token is not valid.' 
		});
	}

	next();
};

module.exports = active;