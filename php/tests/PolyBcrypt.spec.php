<?php

require_once(__DIR__ . '/../src/PolyBcrypt.php');

use PolyCrypto\PolyBcrypt;

describe('PolyBcrypt', function() {

	$password = 'abc';
	$fromJs = '$2a$10$f5449ok7vQOhhHwKwjZqx.cKeuroAr68DDwhxd78JUPJVqoVFqseS';
	$fromPython = '$2a$12$GZJDKqVrXLi0JWdhWZ55EuCb7tKoMINe3Z/RrFFIbQpG3sW8sR7qu';

	it('should throw Exception if password is > 72 chars', function() {
		$longPassword = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ok?';
		try {
			PolyBcrypt::hash($longPassword);
			expect(false)->toBe(true);
		} catch (Exception $e) {
			expect($e)->toBeAnInstanceOf('Exception');
		}
	});

	it('should produce 60-char hash', function() use($password) {
		$hash = PolyBcrypt::hash($password);
		expect($hash)->toHaveLength(60);
	});

	it('should produce different hashes every time', function() use($password) {
		$hash1 = PolyBcrypt::hash($password);
		$hash2 = PolyBcrypt::hash($password);
		expect($hash1)->not->toEqual($hash2);
	});

	it('should verify its own hashes', function() use($password) {
		$hash = PolyBcrypt::hash($password);
		$doesMatch = PolyBcrypt::verify($password, $hash);
		expect($doesMatch)->toBe(true);
	});

	it('should verify passwords from js', function() use($password, $fromJs) {
		$doesMatch = PolyBcrypt::verify($password, $fromJs);
		expect($doesMatch)->toBe(true);
	});

	it('should verify passwords from python', function() use($password, $fromPython) {
		$doesMatch = PolyBcrypt::verify($password, $fromPython);
		expect($doesMatch)->toBe(true);
	});
});

