"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeForge = _interopRequireDefault(require("node-forge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
function () {
  _createClass(PolyAES, [{
    key: "encrypt",

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
        tagLength: 128
      });
      cipher.update(_nodeForge.default.util.createBuffer(data));
      cipher.finish();
      return _nodeForge.default.util.encode64(iv + cipher.mode.tag.data + cipher.output.data);
    }
    /**
     * Decrypt the given data
     * @param {String} data  Data encrypted with AES-256 CBC mode
     * @note The first 32 characters must be the hex-encoded IV
     * @return {String}
     */

  }, {
    key: "decrypt",
    value: function decrypt(data) {
      var mode = 'AES-GCM';

      var bytes = _nodeForge.default.util.decode64(data);

      var iv = bytes.slice(0, 16);
      var tag = bytes.slice(16, 32);
      var ciphertext = bytes.slice(32);

      var decipher = _nodeForge.default.cipher.createDecipher(mode, this._key);

      decipher.start({
        iv: iv,
        tag: tag
      });
      decipher.update(_nodeForge.default.util.createBuffer(ciphertext));
      var ok = decipher.finish();
      return ok ? decipher.output.getBytes() : false;
    }
    /**
     * Crypto constructor
     * @param {String} binKey  The encryption key in binary
     */

  }], [{
    key: "withKey",

    /**
     * Static function to return new Crypto instance
     * @param {String} hexKey  The 256-bit key in hexadecimal (should be 64 characters)
     * @return {PolyAES}
     */
    value: function withKey(hexKey) {
      var binKey = _nodeForge.default.util.hexToBytes(hexKey);

      return new PolyAES(binKey);
    }
    /**
     * Return new Crypto instance with the given user-supplied password
     * @param {String} password  The password from the user
     * @param {String} salt  An application secret salt
     * @param {Number} [numIterations=10000]  The number of iterations for the PBKDF2 hash
     * @return {PolyAES}
     */

  }, {
    key: "withPassword",
    value: function withPassword(password, salt) {
      var numIterations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
      var bytes = 32;

      var binKey = _nodeForge.default.pkcs5.pbkdf2(password, salt, numIterations, bytes);

      return new PolyAES(binKey);
    }
  }]);

  function PolyAES(binKey) {
    _classCallCheck(this, PolyAES);

    this._key = binKey;
  }

  return PolyAES;
}();

exports.default = PolyAES;
