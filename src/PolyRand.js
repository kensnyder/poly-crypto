const forge = require('node-forge');

/**
 * Methods to generate random strings
 */
const PolyRand = {
	/**
	 * {String} Error message to throw when symbol list is too big or small
	 */
	SYMBOL_LIST_ERROR: 'PolyRand: Symbol list must contain between 2 and 256 characters.',

	/**
	 * {Array} The list of symbols to use for slug()
	 */
	SLUG_SYMBOL_LIST: '0123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'.split(''),

	/**
	 * {Array} The list of symbols to use for fax()
	 */
	FAX_SYMBOL_LIST: '3467bcdfhjkmnpqrtvwxy'.split(''),

	/**
	 * Create a string of the given length with random bytes
	 * @param {Number} length  The desired length
	 * @return {String}
	 */
	bytes(length) {
		return forge.random.getBytesSync(length);
	},

	/**
	 * Create a string of the given length with hexidecimal characters
	 * @param {Number} length  The desired length
	 * @return {String}
	 */
	hex(length) {
		return forge.util.bytesToHex(PolyRand.bytes(length / 2));
	},

	/**
	 * Create a string of the given length with numbers, letters, but no vowels
	 * @param {Number} length  The desired length
	 * @return {String}
	 */
	slug(length) {
		return PolyRand.string(length, PolyRand.SLUG_SYMBOL_LIST);
	},

	/**
	 * Create a string of the given length with numbers and lowercase letters that are unambiguious when written down
	 * @param {Number} length  The desired length
	 * @return {String}
	 */
	fax(length) {
		return PolyRand.string(length, PolyRand.FAX_SYMBOL_LIST);
	},

	/**
	 * Create a random string of the given length limited to the given symbols
	 * @param {Number} length  The desired length
	 * @param {Array} symbolList  An array of characters to use
	 * @return {String}
	 * @throws {Error} if size of symbolList is not between 2 and 256
	 */
	string(length, symbolList) {
		const randomBytes = PolyRand.bytes(length);
		if (!Array.isArray(symbolList) || symbolList.length < 2 || symbolList.length > 256) {
			throw new Error(PolyRand.SYMBOL_LIST_ERROR);
		}
		let numSymbols = symbolList.length;
		let output = '';
		for (let i = 0; i < length; i++) {
			let ord = randomBytes.charCodeAt(i);
			output += symbolList[ord % numSymbols];
		}
		return output;
	},
};

module.exports = PolyRand;
