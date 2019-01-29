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
					 * Convert a JavaScript string into binary for encryption
					 * @param {String} data  The regular JavaScript string
					 * @return {String}
					 * @see https://coolaj86.com/articles/javascript-and-unicode-strings-how-to-deal/
					 * @private
					 */
				},
				{
					key: '_utf8ToBin',
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
							throw new Error(
								'PolyAES: key must be 64-character hexadecimal string.'
							);
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
							throw new Error('PolyAES: salt must be 8+ characters.');
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
			]
		);

		function PolyAES(binKey) {
			_classCallCheck(this, PolyAES);

			this._key = binKey;
		}

		return PolyAES;
	})();

exports.PolyAES = PolyAES;
('use strict');

Object.defineProperty(exports, '__esModule', {
	value: true,
});
exports.PolyBcrypt = void 0;

var _bcryptjs = _interopRequireDefault(require('bcryptjs'));

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

var PolyBcrypt =
	/*#__PURE__*/
	(function() {
		function PolyBcrypt() {
			_classCallCheck(this, PolyBcrypt);
		}

		_createClass(PolyBcrypt, null, [
			{
				key: 'hash',
				value: function hash(password) {
					// example output:
					// $2a$10$Smzv/blYQbJBp8v8Wk26uuXEFXSeyjvGsx3VBzZ1zPgXg/Nx9GDuy
					return _bcryptjs.default.hashSync(password);
				},
			},
			{
				key: 'verify',
				value: function verify(password, hash) {
					return _bcryptjs.default.compareSync(password, hash);
				},
			},
		]);

		return PolyBcrypt;
	})();

exports.PolyBcrypt = PolyBcrypt;
