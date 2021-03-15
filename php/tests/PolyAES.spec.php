<?php

require_once(__DIR__ . '/../src/PolyAES.php');

use PolyCrypto\PolyAES;

describe('PolyAES::withKey()', function() {

	$keyUpper = 'C639A572E14D5075C526FDDD43E4ECF6B095EA17783D32EF3D2710AF9F359DD4';
	$keyLower = 'c639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359dd4';
	$keyMixed = 'C639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359DD4';
	$key2     = 'E59DD4C639CF6B095EA17783D32EF3D2710ADD43E4F9F3A572E14D5075C526FD';
	$plaintext = 'abc';
	$jsCiphertext = 'vXDhlmEg34iqeAconwUj6blYEsZzyZFoHavO7I1FNWUnYus=';
	$phpCiphertext = '38yxiaAquwZwqlHX7TWuxBPLoZKsPt4Lb4w6S3f1nLuffSM=';

	it('should throw exception if key is not 64-char hex', function() {
		try {
			PolyAES::withKey('xyz');
			expect(false)->toBe(true);
		} catch (Exception $e) {
			expect($e)->toBeAnInstanceOf('Exception');
		}
	});

	it('should encrypt ok', function() use($keyUpper) {
		$crypto = PolyAES::withKey($keyUpper);
		$data = 'I love encryption';
		$encrypted = $crypto->encrypt($data);
		$decrypted = $crypto->decrypt($encrypted);
		expect($decrypted)->toBe($data);
	});

	it('should handle unicode', function() use($keyUpper) {
		$crypto = PolyAES::withKey($keyUpper);
		$data = 'I ❤️ encryption';
		$encrypted = $crypto->encrypt($data);
		$decrypted = $crypto->decrypt($encrypted);
		expect($decrypted)->toBe($data);
	});

	it('should encrypt differently every time', function() use($key2) {
		$crypto = PolyAES::withKey($key2);
		$data = 'Pack my box with five dozen liquor jugs.';
		$encrypted1 = $crypto->encrypt($data);
		$encrypted2 = $crypto->encrypt($data);
		expect($encrypted1)->not->toEqual($encrypted2);
	});

	it('should treat hexadecimal case insensitively', function() use($keyUpper, $keyLower, $keyMixed) {
		$data = 'She sells sea shells by the sea shore';
		$encrypted = PolyAES::withKey($keyUpper)->encrypt($data);
		$decrypted = PolyAES::withKey($keyLower)->decrypt($encrypted);
		expect($decrypted)->toBe($data);

		$encrypted2 = PolyAES::withKey($keyLower)->encrypt($data);
		$decrypted2 = PolyAES::withKey($keyMixed)->decrypt($encrypted2);
		expect($decrypted2)->toBe($data);

		$encrypted3 = PolyAES::withKey($keyMixed)->encrypt($data);
		$decrypted3 = PolyAES::withKey($keyUpper)->decrypt($encrypted3);
		expect($decrypted3)->toBe($data);
	});

	it('should decrypt php ciphertext', function() use($keyUpper, $plaintext, $phpCiphertext) {
		$data = PolyAES::withKey($keyUpper)->decrypt($phpCiphertext);
		expect($data)->toBe($plaintext);
	});

	it('should decrypt js ciphertext', function() use($keyUpper, $plaintext, $jsCiphertext) {
		$data = PolyAES::withKey($keyUpper)->decrypt($jsCiphertext);
		expect($data)->toBe($plaintext);
	});
});

describe('PolyAes::withPassword()', function() {

	$password = 'The quick brown fox jumped over the lazy dog';
	$salt = 'Four score and seven years ago';
	$plaintext = 'abc';
	$jsCiphertext = 'eX8GRry2EX1v8dKJAEDl4114AaOLGaBlJyNW9JvLiQ8ZHGk=';
	$pyCiphertext = 'AH70szpL2yBv6WK4Ig8BJvlyTRCe7N5EYwvY+0Zv427xCck=';
	$phpCiphertext = '8Qcjp8nNJgiPZIFl5X+qI6E9M/Vej6IurL/y8gdCVMYRhh0=';

	it('should throw exception if salt is too short', function() use($password) {
		try {
			PolyAes::withPassword($password, 'hello w');
			expect(false)->toBe(true);
		} catch (Exception $e) {
			expect($e)->toBeAnInstanceOf('Exception');
		}
	});

	it('should encrypt ok', function() use($password, $salt) {
		$crypto = PolyAes::withPassword($password, $salt);
		$data = 'I love encryption';
		$encrypted = $crypto->encrypt($data);
		$decrypted = $crypto->decrypt($encrypted);
		expect($decrypted)->toBe($data);
	});

	it('should handle unicode', function() use($password, $salt) {
		$crypto = PolyAes::withPassword($password, $salt);
		$data = 'I ❤️ encryption';
		$encrypted = $crypto->encrypt($data);
		$decrypted = $crypto->decrypt($encrypted);
		expect($decrypted)->toBe($data);
	});

	it('should encrypt differently every time', function() {
		$password = 'Pack my box with five dozen liquor jugs';
		$salt = 'Eat more chicken';
		$crypto = PolyAes::withPassword($password, $salt);
		$data = 'If I only had a dollar for every string I\'ve encrypted...';
		$encrypted1 = $crypto->encrypt($data);
		$encrypted2 = $crypto->encrypt($data);
		expect($encrypted1)->not->toEqual($encrypted2);
	});

	it('should decrypt js ciphertext', function() use($password, $salt, $jsCiphertext, $plaintext) {
		$data = PolyAes::withPassword($password, $salt)->decrypt($jsCiphertext);
		expect($data)->toBe($plaintext);
	});

	it('should decrypt php ciphertext', function() use($password, $salt, $phpCiphertext, $plaintext) {
		$data = PolyAes::withPassword($password, $salt)->decrypt($phpCiphertext);
		expect($data)->toBe($plaintext);
	});

	it('should generate salt of proper length', function() {
		$salt = PolyAes::generateSalt(64);
		expect($salt)->toHaveLength(64);
	});

	it('should generate different salt each time', function() {
		$salt1 = PolyAes::generateSalt(64);
		$salt2 = PolyAes::generateSalt(64);
		expect($salt1)->not->toEqual($salt2);
	});
});

