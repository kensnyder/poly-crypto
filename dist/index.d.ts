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
declare class PolyAES {
    /**
     * Error message when key is not in correct format
     */
    static KEY_FORMAT_ERROR: string;
    /**
     * Error message when salt is too short
     */
    static SALT_SIZE_ERROR: string;
    /**
     * Error message when encoding is set to an invalid value
     */
    static ENCODING_ERROR: string;
    /**
     * Default value for this._encoding
     */
    static DEFAULT_ENCODING: string;
    private readonly _key;
    private _encoding;
    /**
     * Static function to return new Crypto instance
     * @param {String} hexKey  The 256-bit key in hexadecimal (should be 64 characters)
     * @return {PolyAES}
     */
    static withKey(hexKey: any): PolyAES;
    /**
     * Return new Crypto instance with the given user-supplied password
     * @param {String} password  The password from the user
     * @param {String} salt  An application secret salt
     * @param {Number} [numIterations=10000]  The number of iterations for the PBKDF2 hash
     * @return {PolyAES}
     */
    static withPassword(password: any, salt: any, numIterations?: number): PolyAES;
    /**
     * Instantiate using a binary key
     * @param {String} binKey  The encryption key in binary
     * @throws Error  If PolyAES.DEFAULT_ENCODING is invalid
     */
    constructor(binKey: any);
    /**
     * After encryption, use base64 encoding, hexadecimal or binary
     * @param {String} encoding  One of: base64, hex, bin
     * @return {PolyAES}
     * @chainable
     */
    setEncoding(encoding: any): this;
    /**
     * Get the current encoding type
     * @return {String}  One of: base64, hex, bin
     */
    getEncoding(): any;
    /**
     * Encode encrypted bytes using the current encoding
     * @param {String} bin  The ciphertext in binary
     * @return {String}  The encoded ciphertext
     * @private
     */
    _binToStr(bin: any): any;
    /**
     * Decode encrypted bytes using the current encoding
     * @param {String} str  The encoded ciphertext
     * @return {String}  The ciphertext in binary
     * @private
     */
    _strToBin(str: any): any;
    /**
     * Encrypt the given data
     * @param {String} data  The string to encrypt
     * @note The first 32 characters of output will be the IV (128 bits in hexadecimal)
     * @return {String}
     */
    encrypt(data: any): any;
    /**
     * Decrypt the given data
     * @param {String} data  Data encrypted with AES-256 CBC mode
     * @note The first 32 characters must be the hex-encoded IV
     * @return {String}
     */
    decrypt(data: any): string | false;
    /**
     * Generate a key to use with PolyAES.withKey()
     * @param {Number} length  The character length of the key
     * @return {String}  The key in hexadecimal
     */
    static generateKey(length?: number): any;
    /**
     * Generate salt to use with PolyAES.withPassword()
     * @param {Number} length  The character length of the salt
     * @return {String}  The salt in hexadecimal
     */
    static generateSalt(length?: number): any;
    /**
     * Convert a JavaScript string into binary for encryption
     * @param {String} data  The regular JavaScript string
     * @return {String}
     * @see https://coolaj86.com/articles/javascript-and-unicode-strings-how-to-deal/
     * @private
     */
    _utf8ToBin(data: any): string;
    /**
     * Convert binary to a JavaScript string after decryption
     * @param {String} data  The regular JavaScript string
     * @return {String}
     * @see https://coolaj86.com/articles/javascript-and-unicode-strings-how-to-deal/
     * @private
     */
    _binToUtf8(data: any): string;
}

/**
 * Functions to hash and verify passwords using bcrypt
 */
declare const PolyBcrypt: {
    /**
     * Exception message when password is too long
     */
    LENGTH_ERROR: string;
    /**
     * Exception message when compute cost is out of range
     */
    COST_ERROR: string;
    /**
     * Hash a password using bcrypt
     * @param {String} password  The password to hash
     * @param {Number} cost  The compute cost (a logarithmic factor) between 4 and 31
     * @return {String}
     * @throws Error  When password is too long or cost is out of range
     */
    hash(password: any, cost?: number): any;
    /**
     * Verify that the given password matches the given hash
     * @param {String} password  The password to check
     * @param {String} hash  The hash the password should match
     * @return {Boolean}  True if password is correct
     */
    verify(password: any, hash: any): any;
    /**
     * Get information about the given hash including version and cost
     * @param {String} hash  The hash to parse
     * @return {Object}
     */
    info(hash: any): {
        valid: boolean;
        version?: undefined;
        cost?: undefined;
        salt?: undefined;
        hash?: undefined;
    } | {
        valid: boolean;
        version: string;
        cost: number;
        salt: string;
        hash: string;
    };
};

/**
 * Calculate digests of strings
 */
declare const PolyDigest: {
    /**
     * Calculate the md5 digest of a string
     * @param {String} data  The string to digest
     * @return {String} The digest in hexadecimal
     */
    md5(data: any): any;
    /**
     * Calculate the sha1 digest of a string
     * @param {String} data  The string to digest
     * @return {String} The digest in hexadecimal
     */
    sha1(data: any): any;
    /**
     * Calculate the sha256 digest of a string
     * @param {String} data  The string to digest
     * @return {String} The digest in hexadecimal
     */
    sha256(data: any): any;
    /**
     * Calculate the sha512 digest of a string
     * @param {String} data  The string to digest
     * @return {String} The digest in hexadecimal
     */
    sha512(data: any): any;
    /**
     * Private function to calculate digests for the given algorithm
     * @param {String} algo  An algorithm on the forge.md namespace
     * @param {String} data  The string to digest
     * @return {String} The digest in hexadecimal
     * @private
     */
    _digest(algo: any, data: any): any;
};

/**
 * Methods to generate random strings
 */
declare const PolyRand: {
    /**
     * {String} Error message to throw when symbol list is too big or small
     */
    SYMBOL_LIST_ERROR: string;
    /**
     * {Array} The list of symbols to use for slug()
     */
    SLUG_SYMBOL_LIST: string[];
    /**
     * {Array} The list of symbols to use for fax()
     */
    FAX_SYMBOL_LIST: string[];
    /**
     * Create a string of the given length with random bytes
     * @param {Number} length  The desired length
     * @return {String}
     */
    bytes(length: any): any;
    /**
     * Create a string of the given length with hexidecimal characters
     * @param {Number} length  The desired length
     * @return {String}
     */
    hex(length: any): any;
    /**
     * Create a string of the given length with numbers, letters, but no vowels
     * @param {Number} length  The desired length
     * @return {String}
     */
    slug(length: any): string;
    /**
     * Create a string of the given length with numbers and lowercase letters that are unambiguious when written down
     * @param {Number} length  The desired length
     * @return {String}
     */
    fax(length: any): string;
    /**
     * Create a random string of the given length limited to the given symbols
     * @param {Number} length  The desired length
     * @param {Array} symbolList  An array of characters to use
     * @return {String}
     * @throws {Error} if size of symbolList is not between 2 and 256
     */
    string(length: any, symbolList: any): string;
};

export { PolyAES, PolyBcrypt, PolyDigest, PolyRand };
