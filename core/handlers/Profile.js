const express = require("express");
const User = require('../models/User');
const Drive = require('../models/Drive');
const Folder = require('../models/Folder');
const File = require('../models/File');
const { readable } = require('../helpers/FileSize');

/**
 * express Router
 */
const ProfileHandler = express.Router();

/**
 * GET /profile
 * get profile info along with stats of 
 * storage usage, drive, folder and file count.
 * it also includes api activity.
 */
ProfileHandler.get('/', async (req, res) => {

	const profile = await User.findOne({ 
		attributes: ['fullname', 'email', 'username', 'activated'],
		where: { id: req.auth.user_id } 
	});
	
	const files = await File.findAll({ 
		attributes: ['size'], 
		where: { user_id: req.auth.user_id } 
	});

	const stats = {};
	const usage = { storage: 0, used: 0, free: 0, percentage: 0.00, readable: '0 B' };

	stats.drives = await Drive.count({ where: { user_id: req.auth.user_id } });
	stats.folders = await Folder.count({ where: { user_id: req.auth.user_id } });
	stats.files = await File.count({ where: { user_id: req.auth.user_id } });
	
	files.forEach(file => { usage.used += file.size; });

	usage.storage = 1024 * 1024 * 1024; // 1 GB
	usage.free = usage.storage - usage.used;
	usage.percentage = ((usage.used * 100) / usage.storage).toFixed(2);
	usage.readable = readable(usage.used);

	res.status(200).json({status: true, data: { profile, stats, usage }});
});

/**
 * POST /profile
 * deletes profile
 */
ProfileHandler.post('/remove', async (req, res) => {

	const isDeactivated = await User.update({
		activated: false
	}, { where: { id: req.auth.user_id } });

	res.status(200).json({
		status: isDeactivated ? true : false,
		message: isDeactivated ? 'Account has been deleted.' : 'Failed to delete account.'
	});

});

module.exports = ProfileHandler;