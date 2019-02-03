<?php

namespace PolyCrypto;

/**
 * Functions to hash and verify passwords using bcrypt
 */
class PolyBcrypt {

	/**
	 * Exception message when password is too long
	 */
	const LENGTH_ERROR = 'PolyBcrypt: password must be 72 bytes or less';

	/**
	 * Exception message when compute cost is out of range
	 */
	const COST_ERROR = 'PolyBcrypt: cost must be between 4 and 31';

	/**
	 * Hash a password using bcrypt
	 * @param string $password  The password to hash
	 * @param int $cost  The compute cost (a logarithmic factor) between 4 and 31
	 * @return string
	 * @throws \Exception  When password is too long or cost is out of range
	 */
	public static function hash(string $password, int $cost=10) : string {
		if (strlen($password) > 72) {
			throw new \Exception(static::LENGTH_ERROR);
		}
		if ($cost < 4 || $cost > 31) {
			throw new \Exception(PolyBcrypt::COST_ERROR);
		}
		return password_hash($password, PASSWORD_BCRYPT, ['cost'=>$cost]);
	}

	/**
	 * Verify that the given password matches the given hash
	 * @param string $password  The password to check
	 * @param string $hash  The hash the password should match
	 * @return bool  True if password is correct
	 * @throws \Exception  When password is too long
	 */
	public static function verify(string $password, string $hash) : bool {
		if (strlen($password) > 72) {
			throw new \Exception(static::LENGTH_ERROR);
		}
		return password_verify($password, $hash);
	}

}
