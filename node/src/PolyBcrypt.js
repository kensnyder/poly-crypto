import bcrypt from 'bcryptjs';

/**
 * Functions to hash and verify passwords using bcrypt
 */
export const PolyBcrypt = {
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
	hash(password, cost = 10) {
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
	 * @throws Error  When password is too long
	 */
	verify(password, hash) {
		if (password.length > 72) {
			throw Error(PolyBcrypt.LENGTH_ERROR);
		}
		return bcrypt.compareSync(password, hash);
	},
};
