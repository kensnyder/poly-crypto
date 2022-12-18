<?php

namespace PolyCrypto;

/**
 * Functions to generate random strings
 */
class PolyRand {
	/**
	 * @var string  Error message to throw when symbol list is too big or small
	 */
	public const SYMBOL_LIST_ERROR = 'PolyRand: Symbol list must contain between 2 and 256 characters.';

	/**
	 * @var array  The list of symbols to use for slug()
	 */
	public const SLUG_SYMBOL_LIST = ['0','1','2','3','4','5','6','7','8','9','b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z','B','C','D','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','W','X','Y','Z'];

	/**
	 * @var array  The list of symbols to use for fax()
	 */
	public const FAX_SYMBOL_LIST = ['3','4','6','7','b','c','d','f','h','j','k','m','n','p','q','r','t','v','w','x','y'];

	/**
	 * Create a string of the given length with random bytes
	 * @param int length  The desired length
	 * @return string
	 * @throws \Exception if platform does not provide cryptographically secure randomness
	 */
	public static function bytes(int $length) : string {
		return random_bytes($length);
	}

	/**
	 * Create a string of the given length with hexidecimal characters
	 * @param int length  The desired length
	 * @return string
	 * @throws \Exception if platform does not provide cryptographically secure randomness
	 */
	public static function hex(int $length) : string {
		return bin2hex(static::bytes($length / 2));
	}

	/**
	 * Create a string of the given length with numbers, letters, but no vowels
	 * @param int length  The desired length
	 * @throws (Never)
	 * @return string
	 */
	public static function slug(int $length) : string {
		return static::string($length, static::SLUG_SYMBOL_LIST);
	}

	/**
	 * Create a string of the given length with numbers and lowercase letters that are unambiguious when written down
	 * @param int  length  The desired length
	 * @throws (Never)
	 * @return string
	 */
	public static function fax(int $length) : string {
		return static::string($length, static::FAX_SYMBOL_LIST);
	}

	/**
	 * Create a random string of the given length limited to the given symbols
	 * @param int length  The desired length
	 * @param array symbolList  An array of characters to use
	 * @throws \Exception if size of $symbolList is not between 2 and 256
	 * @return string
	 */
	public static function string(int $length, array $symbolList) : string {
		$randomBytes = static::bytes($length);
		$numSymbols = count($symbolList);
		if (!is_array($symbolList) || $numSymbols < 2 || $numSymbols > 256) {
			throw new \Exception(static::SYMBOL_LIST_ERROR);
		}
		$output = '';
		foreach (unpack('C*', $randomBytes) as $chr) {
			$output .= $symbolList[$chr % $numSymbols];
		}
		return $output;
	}

	/**
	 * Use cryptographic randomness to generate a uuid v4
	 * @return string
	 */
	public static function uuidv4():string {
		$z = PolyRand::string(1, ['8', '9', 'a', 'b']);
		$x = PolyRand::hex(30);
		// uuidv4 format is xxxxxxxx-xxxx-4xxx-zxxx-xxxxxxxxxxxx
		return preg_replace(
			'/^(.{8})(.{4})(.{3})(.{3})(.{12})$/',
			"$1-$2-4$3-$z$4-$5",
			$x
		);
	}

}
