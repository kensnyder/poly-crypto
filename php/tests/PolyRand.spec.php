<?php

require_once(__DIR__ . '/../src/PolyRand.php');

use PolyCrypto\PolyRand;

describe('PolyRand::bytes()', function() {
	it('should return requested size', function() {
		$hash = PolyRand::bytes(32);
		expect($hash)->toHaveLength(32);
	});
});

describe('PolyRand::hex()', function() {
	it('should return requested size', function() {
		$hash = PolyRand::hex(32);
		expect($hash)->toHaveLength(32);
	});
	it('should return only hex digits', function() {
		$hash = PolyRand::hex(42);
		expect($hash)->toMatch('/^[a-f0-9]{42}$/i');
	});
});

describe('PolyRand::slug()', function() {
	it('should return requested size', function() {
		$hash = PolyRand::slug(11);
		expect($hash)->toHaveLength(11);
	});
	it('should return letters, numbers but no vowels', function() {
		$hash = PolyRand::slug(2000);
		expect($hash)->toMatch('/^[a-z0-9]{2000}$/i');
		expect($hash)->not->toMatch('/[aeiou]/i');
	});
});

describe('PolyRand::fax()', function() {
	it('should return requested size', function() {
		$hash = PolyRand::fax(101);
		expect($hash)->toHaveLength(101);
	});
	it('should return the proper symbol list', function() {
		$hash = PolyRand::fax(2000);
		expect($hash)->toMatch('/^[3467bcdfhjkmnpqrtvwxy]{2000}$/i');
	});
});

describe('PolyRand::string()', function() {
	it('should throw error if symbol list is too short', function() {
		try {
			PolyRand::string(['a'], 101);
			expect(false)->toEqual(true);
		} catch (Exception $e) {
			expect(true)->toEqual(true);
		}
	});
	it('should return requested size', function() {
		$hash = PolyRand::string(['a', 'b', 'c'], 101);
		expect($hash)->toHaveLength(101);
	});
	it('should return the proper symbol list', function() {
		$hash = PolyRand::string(['a', 'b', 'c'], 200);
		expect($hash)->toMatch('/^[abc]{200}$/i');
	});
});
