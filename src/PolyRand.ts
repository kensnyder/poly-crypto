import random from 'node-forge/lib/random';
import util from 'node-forge/lib/util';

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
	 * @param  length  The desired length
	 */
	bytes(length: number): string {
		return random.getBytesSync(length);
	},

	/**
	 * Create a string of the given length with hexidecimal characters
	 * @param  length  The desired length
	 */
	hex(length: number): string {
		return util.bytesToHex(PolyRand.bytes(length / 2));
	},

	/**
	 * Create a string of the given length with numbers, letters, but no vowels
	 * @param length  The desired length
	 */
	slug(length: number): string {
		return PolyRand.string(length, PolyRand.SLUG_SYMBOL_LIST);
	},

	/**
	 * Create a string of the given length with numbers and lowercase letters that are unambiguious when written down
	 * @param  length  The desired length
	 */
	fax(length: number): string {
		return PolyRand.string(length, PolyRand.FAX_SYMBOL_LIST);
	},

	/**
	 * Create a random string of the given length limited to the given symbols
	 * @param length  The desired length
	 * @param symbolList  An array of characters to use
	 * @throws {Error} if size of symbolList is not between 2 and 256
	 */
	string(length: number, symbolList: String[]): string {
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

	/**
	 * Use cryptographic randomness to generate a uuid v4
	 * @return string
	 */
	uuidv4(): string {
		try {
			// In non-https web pages and older node versions,
			// globalThis.crypto is undefined, so we must
			// provide an alternate implementation below.
			return globalThis.crypto.randomUUID();
		} catch (e) {}
		const z = PolyRand.string(1, ['8', '9', 'a', 'b']);
		const x = PolyRand.hex(30);
		// uuidv4 format is xxxxxxxx-xxxx-4xxx-zxxx-xxxxxxxxxxxx
		return x.replace(/^(.{8})(.{4})(.{3})(.{3})(.{12})$/, `$1-$2-4$3-${z}$4-$5`);
	},
};

export default PolyRand;
