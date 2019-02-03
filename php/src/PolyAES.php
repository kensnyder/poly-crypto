<?php

namespace PolyCrypto;

/**
 * Service for encrypting and decrypting data with openssl
 * Compatible with NodeJS's node-forge and Python's PyCryptodome
 * @example
 * // store hexKey in a secure parameter store
 * $hexKey = '64-char hex encoded string from secure param store';
 * $encrypted = PolyAES::withKey($hexKey)->encrypt($data);
 * $decrypted = PolyAES::withKey($hexKey)->decrypt($encrypted);
 *
 * $password = 'User-supplied password';
 * // store salt in a secure parameter store
 * $salt = 'System-supplied salt 8+ characters long';
 * $encrypted = PolyAES::withPassword($password, $salt)->encrypt($data);
 * $decrypted = PolyAES::withPassword($password, $salt)->decrypt($encrypted);
 */
class PolyAES {

	/**
	 * Binary representation of the key
	 * @var string
	 */
	protected $_key;

	const KEY_FORMAT_ERROR = 'PolyAES: key must be 64-character hexadecimal string.';
	const SALT_SIZE_ERROR = 'PolyAES: salt must be 8+ characters.';

	/**
	 * Return new PolyAES instance with the given key
	 * @param string hexKey  The 256-bit key in hexadecimal (should be 64 characters)
	 * @throws \Exception  When key is not a 64-character hexidecimal string
	 * @return PolyAES
	 */
	public static function withKey(string $hexKey) : PolyAES {
		if (!preg_match('/^[A-F0-9]{64}$/i', $hexKey)) {
			throw new \Exception(static::KEY_FORMAT_ERROR);
		}
		$binKey = hex2bin($hexKey);
		return new static($binKey);
	}

	/**
	 * Return new PolyAES instance with the given user-supplied password
	 * @param string $password  The password from the user
	 * @param string $salt  An application secret salt
	 * @param int [$numIterations=10000]  The number of iterations for the PBKDF2 hash
	 * @throws \Exception  When salt is less than 8 characters
	 * @return PolyAES
	 */
	public static function withPassword(string $password, string $salt, int $numIterations = 10000) : PolyAES {
		if (strlen($salt) < 8) {
			throw new \Exception(static::SALT_SIZE_ERROR);
		}
		$bytes = 32;
		$binKey = openssl_pbkdf2($password, $salt, $bytes, $numIterations);
		return new static($binKey);
	}

	/**
	 * Encrypt the given data
	 * @param string data  The string to encrypt
	 * @return string
	 */
	public function encrypt(string $data) : string {
		$mode = 'aes-256-gcm';
		$iv = openssl_random_pseudo_bytes(128 / 8);
		$ciphertext = openssl_encrypt($data, $mode, $this->_key, OPENSSL_RAW_DATA, $iv, $tag); // tag is 128 bits or (16 bytes)
		return base64_encode($iv . $tag . $ciphertext);
	}

	/**
	 * Decrypt the given data
	 * @param string data  Data encrypted with AES-256 GCM mode
	 * @note The first 16 characters must be the binary IV
	 * @note The second 16 characters must be the binary GCM tag
	 * @return string
	 */
	public function decrypt(string $data) : string {
		$mode = 'aes-256-gcm';
		$bytes = base64_decode($data);
		$iv = substr($bytes, 0, 16);
		$tag = substr($bytes, 16, 16);
		$ciphertext = substr($bytes, 32);
		$plaintext = openssl_decrypt($ciphertext, $mode, $this->_key, OPENSSL_RAW_DATA, $iv, $tag);
		return $plaintext;
	}

	/**
	 * Generate key to use with PolyAES::withKey()
	 * @param int $length  The character length of the key
	 * @return string  The key in hexadecimal
	 */
	public static function generateKey($length = 64) {
		return bin2hex(openssl_random_pseudo_bytes($length / 2));
	}

	/**
	 * Generate salt to use with PolyAES::withPassword()
	 * @param int $length  The character length of the salt
	 * @return string  The salt in hexadecimal
	 */
	public static function generateSalt($length = 64) {
		return bin2hex(openssl_random_pseudo_bytes($length / 2));
	}

	/**
	 * PolyAES constructor
	 * @param string $binKey  The 265-bit key in binary
	 */
	public function __construct(string $binKey) {
		$this->_key = $binKey;
	}

}
