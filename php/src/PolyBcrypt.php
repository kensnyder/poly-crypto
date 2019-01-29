<?php

namespace PolyCrypto;

/**
 *
 */
class PolyBcrypt {

	const LENGTH_ERROR = 'PolyBcrypt: password must be 72 characters or less';

	public static function hash($password) {
		if (strlen($password) > 72) {
			throw new \Exception(static::LENGTH_ERROR);
		}
		return password_hash($password, PASSWORD_BCRYPT);
	}

	public static function verify($password, $hash) {
		if (strlen($password) > 72) {
			throw new \Exception(static::LENGTH_ERROR);
		}
		return password_verify($password, $hash);
	}

}
