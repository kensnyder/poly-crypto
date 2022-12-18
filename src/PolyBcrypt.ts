const bcrypt = require('bcryptjs');

/**
 * Functions to hash and verify passwords using bcrypt
 */
const PolyBcrypt = {
	/**
	 * Exception message when password is too long
	 */
	LENGTH_ERROR: 'PolyBcrypt: password must be 72 bytes or less',

	/**
	 * Exception message when compute cost is out of range
	 */
	COST_ERROR: 'PolyBcrypt: cost must be between 4 and 31',

	/**
	 * Hash a password using bcrypt
	 * @param {String} password  The password to hash
	 * @param {Number} cost  The compute cost (a logarithmic factor) between 4 and 31
	 * @return {String}
	 * @throws Error  When password is too long or cost is out of range
	 */
	hash(password, cost = 13) {
		if (password.length > 72) {
			throw Error(PolyBcrypt.LENGTH_ERROR);
		}
		cost = Number(cost);
		if (isNaN(cost) || cost < 4 || cost > 31) {
			throw Error(PolyBcrypt.COST_ERROR);
		}
		const salt = bcrypt.genSaltSync(cost);
		return bcrypt.hashSync(password, salt);
	},

	/**
	 * Verify that the given password matches the given hash
	 * @param {String} password  The password to check
	 * @param {String} hash  The hash the password should match
	 * @return {Boolean}  True if password is correct
	 */
	verify(password, hash) {
		if (password.length > 72) {
			return false;
		}
		return bcrypt.compareSync(password, hash);
	},

	/**
	 * Get information about the given hash including version and cost
	 * @param {String} hash  The hash to parse
	 * @return {Object}
	 */
	info(hash) {
		const match = String(hash).match(/^(\$..?\$)(\d\d)\$(.{22})(.{31})$/);
		if (!match) {
			return {
				valid: false,
			};
		}
		return {
			valid: true,
			version: match[1],
			cost: parseInt(match[2], 10),
			salt: match[3],
			hash: match[4],
		};
	},
};

module.exports = PolyBcrypt;
