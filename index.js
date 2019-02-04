'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
});
exports.PolyAES = void 0;

var _nodeForge = _interopRequireDefault(require('node-forge'));

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError('Cannot call a class as a function');
	}
}

function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ('value' in descriptor) descriptor.writable = true;
		Object.defineProperty(target, descriptor.key, descriptor);
	}
}

function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	return Constructor;
}

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
var PolyAES =
	/*#__PURE__*/
	(function() {
		_createClass(
			PolyAES,
			[
				{
					key: 'encrypt',

					/**
					 * Encrypt the given data
					 * @param {String} data  The string to encrypt
					 * @note The first 32 characters of output will be the IV (128 bits in hexadecimal)
					 * @return {String}
					 */
					value: function encrypt(data) {
						var mode = 'AES-GCM';

						var iv = _nodeForge.default.random.getBytesSync(128 / 8);

						var cipher = _nodeForge.default.cipher.createCipher(mode, this._key);

						cipher.start({
							iv: iv,
							tagLength: 128,
						});
						cipher.update(_nodeForge.default.util.createBuffer(this._utf8ToBin(data)));
						cipher.finish();
						return _nodeForge.default.util.encode64(
							iv + cipher.mode.tag.data + cipher.output.data
						);
					},
					/**
					 * Decrypt the given data
					 * @param {String} data  Data encrypted with AES-256 CBC mode
					 * @note The first 32 characters must be the hex-encoded IV
					 * @return {String}
					 */
				},
				{
					key: 'decrypt',
					value: function decrypt(data) {
						var mode = 'AES-GCM';

						var bytes = _nodeForge.default.util.decode64(data);

						var iv = bytes.slice(0, 16);
						var tag = bytes.slice(16, 32);
						var ciphertext = bytes.slice(32);

						var decipher = _nodeForge.default.cipher.createDecipher(mode, this._key);

						decipher.start({
							iv: iv,
							tag: tag,
						});
						decipher.update(_nodeForge.default.util.createBuffer(ciphertext));
						var ok = decipher.finish();
						return ok ? this._binToUtf8(decipher.output.data) : false;
					},
					/**
					 * Generate a key to use with PolyAES.withKey()
					 * @param {Number} length  The character length of the key
					 * @return {String}  The key in hexadecimal
					 */
				},
				{
					key: '_utf8ToBin',

					/**
					 * Convert a JavaScript string into binary for encryption
					 * @param {String} data  The regular JavaScript string
					 * @return {String}
					 * @see https://coolaj86.com/articles/javascript-and-unicode-strings-how-to-deal/
					 * @private
					 */
					value: function _utf8ToBin(data) {
						if (typeof Buffer !== 'undefined') {
							// node
							return Buffer.from(data, 'utf8').toString('binary');
						} else if (typeof TextEncoder !== 'undefined') {
							// modern browsers
							var encoder = new TextEncoder();
							var buf = encoder.encode(data);
							var bin = '';
							buf.forEach(function(i) {
								bin += String.fromCharCode(i);
							});
							return bin;
						} else {
							// slower but vanilla js
							var escstr = encodeURIComponent(data);

							var _bin = escstr.replace(/%([0-9A-F]{2})/gi, function($0, hex) {
								return String.fromCharCode(parseInt(hex, 16));
							});

							return _bin;
						}
					},
					/**
					 * Convert binary to a JavaScript string after decryption
					 * @param {String} data  The regular JavaScript string
					 * @return {String}
					 * @see https://coolaj86.com/articles/javascript-and-unicode-strings-how-to-deal/
					 * @private
					 */
				},
				{
					key: '_binToUtf8',
					value: function _binToUtf8(data) {
						if (typeof Buffer !== 'undefined') {
							// node
							return Buffer.from(data, 'binary').toString('utf8');
						} else if (
							typeof TextDecoder !== 'undefined' &&
							typeof Uint8Array !== 'undefined'
						) {
							// modern browsers
							var decoder = new TextDecoder('utf-8');
							var arr = [];
							data.split('').forEach(function(c) {
								arr.push(c.charCodeAt(0));
							});
							return decoder.decode(Uint8Array.from(arr));
						} else {
							// slower but vanilla js
							var escstr = data.replace(/./g, function(char) {
								var code = char
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
					},
					/**
					 * Crypto constructor
					 * @param {String} binKey  The encryption key in binary
					 */
				},
			],
			[
				{
					key: 'withKey',

					/**
					 * Static function to return new Crypto instance
					 * @param {String} hexKey  The 256-bit key in hexadecimal (should be 64 characters)
					 * @return {PolyAES}
					 */
					value: function withKey(hexKey) {
						if (!/^[A-F0-9]{64}$/i.test(hexKey)) {
							throw new Error(PolyAES.KEY_FORMAT_ERROR);
						}

						var binKey = _nodeForge.default.util.hexToBytes(hexKey);

						return new PolyAES(binKey);
					},
					/**
					 * Return new Crypto instance with the given user-supplied password
					 * @param {String} password  The password from the user
					 * @param {String} salt  An application secret salt
					 * @param {Number} [numIterations=10000]  The number of iterations for the PBKDF2 hash
					 * @return {PolyAES}
					 */
				},
				{
					key: 'withPassword',
					value: function withPassword(password, salt) {
						var numIterations =
							arguments.length > 2 && arguments[2] !== undefined
								? arguments[2]
								: 10000;

						if (String(salt).length < 8) {
							throw new Error(PolyAES.SALT_SIZE_ERROR);
						}

						var bytes = 32;

						var binKey = _nodeForge.default.pkcs5.pbkdf2(
							password,
							salt,
							numIterations,
							bytes
						);

						return new PolyAES(binKey);
					},
				},
				{
					key: 'generateKey',
					value: function generateKey() {
						var length =
							arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 64;
						return _nodeForge.default.util.bytesToHex(
							_nodeForge.default.random.getBytesSync(length / 2)
						);
					},
					/**
					 * Generate salt to use with PolyAES.withPassword()
					 * @param {Number} length  The character length of the salt
					 * @return {String}  The salt in hexadecimal
					 */
				},
				{
					key: 'generateSalt',
					value: function generateSalt() {
						var length =
							arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 64;
						return _nodeForge.default.util.bytesToHex(
							_nodeForge.default.random.getBytesSync(length / 2)
						);
					},
				},
			]
		);

		function PolyAES(binKey) {
			_classCallCheck(this, PolyAES);

			this._key = binKey;
		}

		return PolyAES;
	})();

exports.PolyAES = PolyAES;
PolyAES.KEY_FORMAT_ERROR = 'PolyAES: key must be 64-character hexadecimal string.';
PolyAES.SALT_SIZE_ERROR = 'PolyAES: salt must be 8+ characters.';
('use strict');

Object.defineProperty(exports, '__esModule', {
	value: true,
});
exports.PolyBcrypt = void 0;

var _bcryptjs = _interopRequireDefault(require('bcryptjs'));

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Functions to hash and verify passwords using bcrypt
 */
var PolyBcrypt = {
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
	hash: function hash(password) {
		var cost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

		if (password.length > 72) {
			throw Error(PolyBcrypt.LENGTH_ERROR);
		}

		cost = Number(cost);

		if (isNaN(cost) || cost < 4 || cost > 31) {
			throw Error(PolyBcrypt.COST_ERROR);
		}

		var salt = _bcryptjs.default.genSaltSync(cost);

		return _bcryptjs.default.hashSync(password, salt);
	},

	/**
	 * Verify that the given password matches the given hash
	 * @param {String} password  The password to check
	 * @param {String} hash  The hash the password should match
	 * @return {Boolean}  True if password is correct
	 * @throws Error  When password is too long
	 */
	verify: function verify(password, hash) {
		if (password.length > 72) {
			throw Error(PolyBcrypt.LENGTH_ERROR);
		}

		return _bcryptjs.default.compareSync(password, hash);
	},
};
exports.PolyBcrypt = PolyBcrypt;
('use strict');

Object.defineProperty(exports, '__esModule', {
	value: true,
});
exports.PolyHash = void 0;

var _nodeForge = _interopRequireDefault(require('node-forge'));

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Calculate hashes of strings
 */
var PolyHash = {
	/**
	 * Calculate the md5 hash of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	md5: function md5(data) {
		return PolyHash._hash('md5', data);
	},

	/**
	 * Calculate the sha1 hash of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha1: function sha1(data) {
		return PolyHash._hash('sha1', data);
	},

	/**
	 * Calculate the sha256 hash of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha256: function sha256(data) {
		return PolyHash._hash('sha256', data);
	},

	/**
	 * Calculate the sha512 hash of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha512: function sha512(data) {
		return PolyHash._hash('sha512', data);
	},

	/**
	 * Private function to calculate hashes for the given algorithm
	 * @param {String} algo  An algorithm on the forge.md namespace
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 * @private
	 */
	_hash: function _hash(algo, data) {
		var md = _nodeForge.default.md[algo].create();

		md.update(data);
		return md.digest().toHex();
	},
};
exports.PolyHash = PolyHash;
('use strict');

Object.defineProperty(exports, '__esModule', {
	value: true,
});
exports.PolyPkcs5 = void 0;

var _nodeForge = _interopRequireDefault(require('node-forge'));

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var PolyPkcs5 = {
	hash: function hash(password) {
		var numIterations = 100000;

		var salt = _nodeForge.default.random.getBytesSync(128);

		var key = _nodeForge.default.pkcs5.pbkdf2(password, salt, numIterations, 16);

		return _nodeForge.default.util.bytesToHex(salt) + _nodeForge.default.util.bytesToHex(key);
	},
	verify: function verify(password, hash) {
		var numIterations = 100000;

		var salt = _nodeForge.default.util.hexToBytes(hash.slice(0, 64));

		var key = _nodeForge.default.util.hexToBytes(hash.slice(64));

		var digest = _nodeForge.default.pkcs5.pbkdf2(password, salt, numIterations, 16); // sha256 ?

		return digest === key;
	},
};
exports.PolyPkcs5 = PolyPkcs5;
('use strict');

Object.defineProperty(exports, '__esModule', {
	value: true,
});
exports.PolyRand = void 0;

var _nodeForge = _interopRequireDefault(require('node-forge'));

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Methods to generate random strings
 */
var PolyRand = {
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
	bytes: function bytes(length) {
		return _nodeForge.default.random.getBytesSync(length);
	},

	/**
	 * Create a string of the given length with hexidecimal characters
	 * @param {Number} length  The desired length
	 * @return {String}
	 */
	hex: function hex(length) {
		return _nodeForge.default.util.bytesToHex(PolyRand.bytes(length / 2));
	},

	/**
	 * Create a string of the given length with numbers, letters, but no vowels
	 * @param {Number} length  The desired length
	 * @return {String}
	 */
	slug: function slug(length) {
		return PolyRand.string(PolyRand.SLUG_SYMBOL_LIST, length);
	},

	/**
	 * Create a string of the given length with numbers and lowercase letters that are unambiguious when written down
	 * @param {Number} length  The desired length
	 * @return {String}
	 */
	fax: function fax(length) {
		return PolyRand.string(PolyRand.FAX_SYMBOL_LIST, length);
	},

	/**
	 * Create a random string of the given length limited to the given symbols
	 * @param {Array} symbolList  An array of characters to use
	 * @param {Number} length  The desired length
	 * @return {String}
	 * @throws {Error} if size of symbolList is not between 2 and 256
	 */
	string: function string(symbolList, length) {
		var randomBytes = PolyRand.bytes(length);

		if (!Array.isArray(symbolList) || symbolList.length < 2 || symbolList.length > 256) {
			throw new Error(PolyRand.SYMBOL_LIST_ERROR);
		}

		var numSymbols = symbolList.length;
		var output = '';

		for (var i = 0; i < length; i++) {
			var ord = randomBytes.charCodeAt(i);
			output += symbolList[ord % numSymbols];
		}

		return output;
	},
};
exports.PolyRand = PolyRand;
