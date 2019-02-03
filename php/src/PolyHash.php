<?php

namespace PolyCrypto;

/**
 * Calculate hashes of strings
 */
class PolyHash {

	/**
	 * Calculate the md5 hash of a string
	 * @param string $data  The string to digest
	 * @return string  The digest in hexadecimal
	 */
	public static function md5(string $data) : string {
		return hash('md5', $data);
	}

	/**
	 * Calculate the sha1 hash of a string
	 * @param string $data  The string to digest
	 * @return string  The digest in hexadecimal
	 */
	public static function sha1(string $data) : string {
		return hash('sha1', $data);
	}

	/**
	 * Calculate the sha256 hash of a string
	 * @param string $data  The string to digest
	 * @return string  The digest in hexadecimal
	 */
	public static function sha256(string $data) : string {
		return hash('sha256', $data);
	}

	/**
	 * Calculate the sha512 hash of a string
	 * @param string $data  The string to digest
	 * @return string  The digest in hexadecimal
	 */
	public static function sha512(string $data) : string {
		return hash('sha512', $data);
	}

}
