import forge from 'node-forge';

/**
 * Calculate hashes of strings
 */
export const PolyHash = {
	/**
	 * Calculate the md5 hash of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	md5(data) {
		return PolyHash._hash('md5', data);
	},

	/**
	 * Calculate the sha1 hash of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha1(data) {
		return PolyHash._hash('sha1', data);
	},

	/**
	 * Calculate the sha256 hash of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha256(data) {
		return PolyHash._hash('sha256', data);
	},

	/**
	 * Calculate the sha512 hash of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha512(data) {
		return PolyHash._hash('sha512', data);
	},

	/**
	 * Private function to calculate hashes for the given algorithm
	 * @param {String} algo  An algorithm on the forge.md namespace
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 * @private
	 */
	_hash(algo, data) {
		const md = forge.md[algo].create();
		md.update(data);
		return md.digest().toHex();
	},
};
