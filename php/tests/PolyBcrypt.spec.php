<?php

require_once(__DIR__ . '/../src/PolyBcrypt.php');

use PolyCrypto\PolyBcrypt;

$password = 'abc';
$fromJs = '$2a$10$f5449ok7vQOhhHwKwjZqx.cKeuroAr68DDwhxd78JUPJVqoVFqseS';
$fromPython = '$2a$12$GZJDKqVrXLi0JWdhWZ55EuCb7tKoMINe3Z/RrFFIbQpG3sW8sR7qu';
$fromPhp = '$2y$10$npEa/T9.5/aR36tMgICKYufSsReq9P9ioxV0cIpbB20KynjoYOz4.';


describe('PolyBcrypt::hash()', function() use($password) {

	it('should ensure password is at most 72 chars', function () {
		$longPassword = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ok?';
		try {
			PolyBcrypt::hash($longPassword);
			expect(false)->toBe(true);
		} catch (Exception $e) {
			expect($e)->toBeAnInstanceOf('Exception');
		}
	});

	it('should ensure cost is at least 4', function () use($password) {
		try {
			PolyBcrypt::hash($password, 3);
			expect(false)->toBe(true);
		} catch (Exception $e) {
			expect($e)->toBeAnInstanceOf('Exception');
		}
	});

	it('should ensure cost is at most 31', function () use($password) {
		try {
			PolyBcrypt::hash($password, 32);
			expect(false)->toBe(true);
		} catch (Exception $e) {
			expect($e)->toBeAnInstanceOf('Exception');
		}
	});

	it('should produce 60-char hash', function () use ($password) {
		$hash = PolyBcrypt::hash($password);
		expect($hash)->toHaveLength(60);
	});

	it('should produce different hashes every time', function () use ($password) {
		$hash1 = PolyBcrypt::hash($password, 10);
		$hash2 = PolyBcrypt::hash($password, 10);
		expect($hash1)->not->toEqual($hash2);
	});

	it('should handle unicode', function() {
		$hash = PolyBcrypt::hash('Ich weiß nicht 🔥. Bitte schön.', 10);
		expect($hash)->toMatch('/^\$\d[a-z]\$10\$[\w.\/]{53}$/i');
	});

	it('should verify its own hashes', function () use ($password) {
		$hash = PolyBcrypt::hash($password);
		$doesMatch = PolyBcrypt::verify($password, $hash);
		expect($doesMatch)->toBe(true);
	});

});

describe('PolyBcrypt::verify()', function() use($password, $fromJs, $fromPython, $fromPhp) {

	it('should verify passwords from js', function() use($password, $fromJs) {
		$doesMatch = PolyBcrypt::verify($password, $fromJs);
		expect($doesMatch)->toBe(true);
	});

	it('should verify passwords from python', function() use($password, $fromPython) {
		$doesMatch = PolyBcrypt::verify($password, $fromPython);
		expect($doesMatch)->toBe(true);
	});

	it('should verify passwords from php', function() use($password, $fromPhp) {
		$doesMatch = PolyBcrypt::verify($password, $fromPhp);
		expect($doesMatch)->toBe(true);
	});

});


describe('PolyBcrypt::info()', function() use($password, $fromJs, $fromPython, $fromPhp) {

	it('should parse hashes from js', function() use($fromJs) {
		$actual = (array) PolyBcrypt::info($fromJs);
		$expected = [
			'valid' => true,
			'version' => '$2a$',
			'cost' => 10,
			'salt' => 'f5449ok7vQOhhHwKwjZqx.',
			'hash' => 'cKeuroAr68DDwhxd78JUPJVqoVFqseS',
		];
		$diff = array_diff_assoc($actual, $expected);
		expect($diff)->toBeEmpty();
	});

	it('should parse hashes from python', function() use($fromPython) {
		$actual = (array) PolyBcrypt::info($fromPython);
		$expected = [
			'valid' => true,
			'version' => '$2a$',
			'cost' => 12,
			'salt' => 'GZJDKqVrXLi0JWdhWZ55Eu',
			'hash' => 'Cb7tKoMINe3Z/RrFFIbQpG3sW8sR7qu',
		];
		$diff = array_diff_assoc($actual, $expected);
		expect($diff)->toBeEmpty();
	});

	it('should parse hashes from php', function() use($fromPhp) {
		$actual = (array) PolyBcrypt::info($fromPhp);
		$expected = [
			'valid' => true,
			'version' => '$2y$',
			'cost' => 10,
			'salt' => 'npEa/T9.5/aR36tMgICKYu',
			'hash' => 'fSsReq9P9ioxV0cIpbB20KynjoYOz4.',
		];
		$diff = array_diff_assoc($actual, $expected);
		expect($diff)->toBeEmpty();
	});

});
