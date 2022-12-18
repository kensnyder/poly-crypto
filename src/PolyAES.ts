import { AesEncodings } from './types';
import util from 'node-forge/lib/util';
import pbkdf2 from 'node-forge/lib/pbkdf2';
import random from 'node-forge/lib/random';
import cipher from 'node-forge/lib/cipher';

/**
 * Service for encrypting and decrypting data with AES-256 GCM
 * Compatible with PHP's openssl_encrypt()
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
	 * Error message when key is not in correct format
	 */
	static KEY_FORMAT_ERROR = 'PolyAES: key must be 64-character hexadecimal string.';

	/**
	 * Error message when salt is too short
	 */
	static SALT_SIZE_ERROR = 'PolyAES: salt must be 8+ characters.';

	/**
	 * Error message when encoding is set to an invalid value
	 */
	static ENCODING_ERROR = 'PolyAES: encoding must be base64, hex, or bin.';

	/**
	 * Default value for this._encoding
	 */
	static DEFAULT_ENCODING: AesEncodings = 'base64';

	private readonly _key;
	private _encoding;

	/**
	 * Static function to return new Crypto instance
	 * @param {String} hexKey  The 256-bit key in hexadecimal (should be 64 characters)
	 * @return {PolyAES}
	 */
	static withKey(hexKey: string): PolyAES {
		if (!/^[A-F0-9]{64}$/i.test(hexKey)) {
			throw new Error(PolyAES.KEY_FORMAT_ERROR);
		}
		const binKey = util.hexToBytes(hexKey);
		return new PolyAES(binKey);
	}

	/**
	 * Return new Crypto instance with the given user-supplied password
	 * @param {String} password  The password from the user
	 * @param {String} salt  An application secret salt
	 * @param {Number} [numIterations=10000]  The number of iterations for the PBKDF2 hash
	 * @return {PolyAES}
	 */
	static withPassword(password: string, salt: string, numIterations: number = 10000): PolyAES {
		if (String(salt).length < 8) {
			throw new Error(PolyAES.SALT_SIZE_ERROR);
		}
		const bytes = 32;
		const binKey = pbkdf2(password, salt, numIterations, bytes);
		return new PolyAES(binKey);
	}

	/**
	 * Instantiate using a binary key
	 * @param {util.ByteStringBuffer} binKey  The encryption key in binary
	 * @throws Error  If PolyAES.DEFAULT_ENCODING is invalid
	 */
	constructor(binKey: util.ByteStringBuffer) {
		this._key = binKey;
		this.setEncoding(PolyAES.DEFAULT_ENCODING);
	}

	/**
	 * After encryption, use base64 encoding, hexadecimal or binary
	 * @param {String} encoding  One of: base64, hex, bin
	 * @return {PolyAES}
	 * @chainable
	 */
	setEncoding(encoding: AesEncodings) {
		const allowed = ['base64', 'hex', 'bin'];
		if (allowed.indexOf(encoding) === -1) {
			throw new Error(PolyAES.ENCODING_ERROR);
		}
		this._encoding = encoding;
		return this;
	}

	/**
	 * Get the current encoding type
	 * @return {String}  One of: base64, hex, bin
	 */
	getEncoding(): string {
		return this._encoding;
	}

	/**
	 * Encode encrypted bytes using the current encoding
	 * @param {String} bin  The ciphertext in binary
	 * @return {String}  The encoded ciphertext
	 * @private
	 */
	_binToStr(bin: util.ByteStringBuffer) {
		if (this._encoding === 'bin') {
			return bin;
		} else if (this._encoding === 'base64') {
			return util.encode64(bin);
		} else if (this._encoding === 'hex') {
			return util.bytesToHex(bin);
		}
	}

	/**
	 * Decode encrypted bytes using the current encoding
	 * @param {String} str  The encoded ciphertext
	 * @return {String}  The ciphertext in binary
	 * @private
	 */
	_strToBin(str: string): util.ByteStringBuffer {
		if (this._encoding === 'bin') {
			return str;
		} else if (this._encoding === 'base64') {
			return util.decode64(str);
		} else if (this._encoding === 'hex') {
			return util.hexToBytes(str);
		}
	}

	/**
	 * Encrypt the given data
	 * @param {String} data  The string to encrypt
	 * @note The first 32 characters of output will be the IV (128 bits in hexadecimal)
	 * @return {String}
	 */
	encrypt(data: string): string {
		const mode = 'AES-GCM';
		const iv = random.getBytesSync(128 / 8);
		const ciph = cipher.createCipher(mode, this._key);
		ciph.start({ iv, tagLength: 128 });
		ciph.update(util.createBuffer(this._utf8ToBin(data)));
		ciph.finish();
		return this._binToStr(iv + ciph.mode.tag.data + ciph.output.data);
	}

	/**
	 * Decrypt the given data
	 * @param {String} data  Data encrypted with AES-256 CBC mode
	 * @note The first 32 characters must be the hex-encoded IV
	 * @return {String}
	 */
	decrypt(data: string): string {
		const mode = 'AES-GCM';
		const bytes = this._strToBin(data);
		const iv = bytes.slice(0, 16);
		const tag = bytes.slice(16, 32);
		const ciphertext = bytes.slice(32);
		const decipher = cipher.createDecipher(mode, this._key);
		decipher.start({ iv, tag });
		decipher.update(util.createBuffer(ciphertext));
		const ok = decipher.finish();
		return ok ? this._binToUtf8(decipher.output.data) : false;
	}

	/**
	 * Generate a key to use with PolyAES.withKey()
	 * @param {Number} length  The character length of the key
	 * @return {String}  The key in hexadecimal
	 */
	static generateKey(length: number = 64): string {
		return util.bytesToHex(random.getBytesSync(length / 2));
	}

	/**
	 * Generate salt to use with PolyAES.withPassword()
	 * @param {Number} length  The character length of the salt
	 * @return {String}  The salt in hexadecimal
	 */
	static generateSalt(length: number = 64): string {
		return util.bytesToHex(random.getBytesSync(length / 2));
	}

	/**
	 * Convert a JavaScript string into binary for encryption
	 * @param {String} data  The regular JavaScript string
	 * @return {String}
	 * @see https://coolaj86.com/articles/javascript-and-unicode-strings-how-to-deal/
	 * @private
	 */
	_utf8ToBin(data: string): string {
		if (typeof Buffer !== 'undefined') {
			// node
			return Buffer.from(data, 'utf8').toString('binary');
		} else if (typeof TextEncoder !== 'undefined') {
			// modern browsers
			const encoder = new TextEncoder();
			const buf = encoder.encode(data);
			let bin = '';
			buf.forEach(function (i) {
				bin += String.fromCharCode(i);
			});
			return bin;
		} else {
			// slower but vanilla js
			const escstr = encodeURIComponent(data);
			const bin = escstr.replace(/%([0-9A-F]{2})/gi, function ($0, hex) {
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
	_binToUtf8(data: string): util.ByteStringBuffer {
		if (typeof Buffer !== 'undefined') {
			// node
			return Buffer.from(data, 'binary').toString('utf8');
		} else if (typeof TextDecoder !== 'undefined' && typeof Uint8Array !== 'undefined') {
			// modern browsers
			const decoder = new TextDecoder('utf-8');
			const arr = [];
			data.split('').forEach(function (c) {
				arr.push(c.charCodeAt(0));
			});
			return decoder.decode(Uint8Array.from(arr));
		} else {
			// slower but vanilla js
			const escstr = data.replace(/./g, function (char) {
				let code = char.charCodeAt(0).toString(16).toUpperCase();
				if (code.length < 2) {
					code = '0' + code;
				}
				return '%' + code;
			});
			return decodeURIComponent(escstr);
		}
	}
}
