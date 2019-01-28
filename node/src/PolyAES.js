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
		if (!/^[A-F0-9]{64}$/i.test(hexKey)) {
			throw new Error('PolyAES: key must be 64-character hexadecimal string.');
		}
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
	static withPassword(password, salt, numIterations = 10000) {
		if (String(salt).length < 8) {
			throw new Error('PolyAES: salt must be 8+ characters.');
		}
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
		cipher.update(forge.util.createBuffer(this._utf8ToBin(data)));
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
		if (!ok) {
			console.log('failed to decrypt ' + data);
		}
		return ok ? this._binToUtf8(decipher.output.data) : false;
	}

	/**
	 * Convert a JavaScript string into binary for encryption
	 * @param {String} data  The regular JavaScript string
	 * @return {String}
	 * @see https://coolaj86.com/articles/javascript-and-unicode-strings-how-to-deal/
	 * @private
	 */
	_utf8ToBin(data) {
		if (typeof Buffer !== 'undefined') {
			// node
			return Buffer.from(data, 'utf8').toString('binary');
		} else if (typeof TextEncoder !== 'undefined') {
			// modern browsers
			const encoder = new TextEncoder();
			const buf = encoder.encode(data);
			let bin = '';
			buf.forEach(function(i) {
				bin += String.fromCharCode(i);
			});
			return bin;
		} else {
			// slower but vanilla js
			const escstr = encodeURIComponent(str);
			const bin = escstr.replace(/%([0-9A-F]{2})/gi, function(_, hex) {
				return String.fromCharCode(parseInt(hex, 16));
			});
			return bin;
		}
	}

	/**
	 * Convert binary to a JavaScript string after decryption
	 * @param {String} data  The regular JavaScript string
	 * @return {String}
	 * @see https://coolaj86.com/articles/javascript-and-unicode-strings-how-to-deal/
	 * @private
	 */
	_binToUtf8(data) {
		if (typeof Buffer !== 'undefined') {
			// node
			return Buffer.from(data, 'binary').toString('utf8');
		} else if (typeof TextDecoder !== 'undefined' && typeof Uint8Array !== 'undefined') {
			// modern browsers
			const decoder = new TextDecoder('utf-8');
			const arr = [];
			data.split('').forEach(function(c) {
				arr.push(c.charCodeAt(0));
			});
			return decoder.decode(Uint8Array.from(arr));
		} else {
			// slower but vanilla js
			const escstr = binstr.replace(/(.)/g, function(m, p) {
				let code = p
					.charCodeAt(0)
					.toString(16)
					.toUpperCase();
				if (code.length < 2) {
					code = '0' + code;
				}
				return '%' + code;
			});
			return decodeURIComponent(escstr);
		}
	}

	/**
	 * Crypto constructor
	 * @param {String} binKey  The encryption key in binary
	 */
	constructor(binKey) {
		this._key = binKey;
	}
}
