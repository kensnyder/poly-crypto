import forge from 'node-forge';

/**
 * Service for encrypting and decrypting data with AES-256 GCM
 * Compatible with PHP's openssl_encrypt() and Python's PyCryptodome
 * @example
 * // store hexKey in a secure parameter store
 * const hexKey = '64-char hex encoded string from secure param store';
 * const encrypted = PolyAES.withKey(hexKey).encrypt(data);
 * const decrypted = PolyAES.withKey(hexKey).decrypt(encrypted);
 *
 * const password = 'User-supplied password';
 * const salt = 'System-supplied salt 8+ characters long';
 * const encrypted = PolyAES.withPassword(password, salt).encrypt(data);
 * const decrypted = PolyAES.withPassword(password, salt).decrypt(encrypted);
 */
export default class PolyAES {
	/**
	 * Static function to return new Crypto instance
	 * @param {String} hexKey  The 256-bit key in hexadecimal (should be 64 characters)
	 * @return {PolyAES}
	 */
	static withKey(hexKey) {
		const binKey = forge.util.hexToBytes(hexKey);
		return new PolyAES(binKey);
	}

	/**
	 * Return new Crypto instance with the given user-supplied password
	 * @param {String} password  The password from the user
	 * @param {String} salt  An application secret salt
	 * @param {Number} [numIterations=10000]  The number of iterations for the PBKDF2 hash
	 * @return {PolyAES}
	 */
	static withPassword(password, salt, numIterations = 1000) {
		const bytes = 32;
		const binKey = forge.pkcs5.pbkdf2(password, salt, numIterations, bytes);
		return new PolyAES(binKey);
	}

	/**
	 * Encrypt the given data
	 * @param {String} data  The string to encrypt
	 * @note The first 32 characters of output will be the IV (128 bits in hexadecimal)
	 * @return {String}
	 */
	encrypt(data) {
		const mode = 'AES-GCM';
		const iv = forge.random.getBytesSync(128 / 8);
		const cipher = forge.cipher.createCipher(mode, this._key);
		cipher.start({ iv, tagLength: 128 });
		cipher.update(forge.util.createBuffer(data));
		cipher.finish();
		return forge.util.encode64(iv + cipher.mode.tag.data + cipher.output.data);
	}

	/**
	 * Decrypt the given data
	 * @param {String} data  Data encrypted with AES-256 CBC mode
	 * @note The first 32 characters must be the hex-encoded IV
	 * @return {String}
	 */
	decrypt(data) {
		const mode = 'AES-GCM';
		const bytes = forge.util.decode64(data);
		const iv = bytes.slice(0, 16);
		const tag = bytes.slice(16, 32);
		const ciphertext = bytes.slice(32);
		const decipher = forge.cipher.createDecipher(mode, this._key);
		decipher.start({ iv, tag });
		decipher.update(forge.util.createBuffer(ciphertext));
		const ok = decipher.finish();
		return ok ? decipher.output.getBytes() : false;
	}

	/**
	 * Crypto constructor
	 * @param {String} binKey  The encryption key in binary
	 */
	constructor(binKey) {
		this._key = binKey;
	}
}
