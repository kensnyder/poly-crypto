<?php

require_once(__DIR__ . '/../src/PolyAES.php');

use PolyAES\PolyAES;

describe('PolyAES::withKey', function() {

	$keyUpper = 'C639A572E14D5075C526FDDD43E4ECF6B095EA17783D32EF3D2710AF9F359DD4';
	$keyLower = 'c639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359dd4';
	$keyMixed = 'C639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359DD4';
	$key2     = 'E59DD4C639CF6B095EA17783D32EF3D2710ADD43E4F9F3A572E14D5075C526FD';
	$sheSellsDecrypted = 'She sells sea shells by the sea shore';
	$sheSellsEncrypted = 'dOdjhDQkzxa+RS5HuafKdiUC9N20Hd58w1A26RVfanhvAgI5OkHDoWihExGDI1xNZ8d4eH3a0JzQZeGh9BTfNTEatrLr';

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

	it('should interoperate with Python and PHP', function() use($keyUpper, $sheSellsEncrypted, $sheSellsDecrypted) {
		$data = PolyAES::withKey($keyUpper)->decrypt($sheSellsEncrypted);
		expect($data)->toBe($sheSellsDecrypted);
	});
});
