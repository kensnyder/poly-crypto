<?php

require_once(__DIR__ . '/../src/PolyAES.php');

use PolyCrypto\PolyAES;

describe('PolyAes::withKey', function() {

	$password = 'The quick brown fox jumped over the lazy dog';
	$salt = 'Four score and seven years ago';
	$sheSellsDecrypted = 'She sells sea shells by the sea shore';
	$sheSellsEncrypted = 'GiObuZIKnYW7L9Jx2goDVGF1FH+COmCEGqk+T3gwZMeXi+ZMQbyOPN8GOwtuIEPS5YDAear0j9lNmOqxrr/iM7nfBAya';

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

	it('should interoperate with Python and PHP', function() use($password, $salt, $sheSellsEncrypted, $sheSellsDecrypted) {
		$data = PolyAes::withPassword($password, $salt)->decrypt($sheSellsEncrypted);
		expect($data)->toBe($sheSellsDecrypted);
	});
});

