
/**
 * converts byte file size to human readable format.
 * @param {number} length the file size (in bytes). 
 */
const readable = (length) => {
	const units = ['B', 'KB', 'MB', 'GB'];
	let i = 0;
	while(length >= 1024 && i++ < units.length) {
		length /= 1024;
	}
	return `${length.toFixed(2)} ${units[i]}`;
}

module.exports = { readable };