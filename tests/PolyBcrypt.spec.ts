import { describe, it, expect } from "vitest";
import { PolyBcrypt } from '../index.js';

const password = 'abc';
const fromPhp = '$2y$10$npEa/T9.5/aR36tMgICKYufSsReq9P9ioxV0cIpbB20KynjoYOz4.';
const fromJs = '$2a$10$f5449ok7vQOhhHwKwjZqx.cKeuroAr68DDwhxd78JUPJVqoVFqseS';

describe('PolyBcrypt.hash', () => {
	it('should ensure password is at most 72 chars', () => {
		const longPassword =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ok?';
		try {
			PolyBcrypt.hash(longPassword);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
		}
	});
	it('should ensure cost is at least 4', () => {
		try {
			PolyBcrypt.hash(password, 3);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
		}
	});
	it('should ensure cost is at most 31', () => {
		try {
			PolyBcrypt.hash(password, 32);
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
		}
	});
	it('should produce 60 char string', () => {
		const hash = PolyBcrypt.hash(password);
		expect(hash.length).toBe(60);
	});

	it('should produce different hashes every time', () => {
		const hash1 = PolyBcrypt.hash(password, 10);
		const hash2 = PolyBcrypt.hash(password, 10);
		expect(hash1).not.toBe(hash2);
	});
	it('should handle unicode', () => {
		const hash = PolyBcrypt.hash('Ich weiß nicht 🔥. Bitte schön.', 10);
		expect(hash).toMatch(/^\$\d[a-z]\$10\$[\w.\/]{53}$/i);
	});
	it('should verify its own hashes', () => {
		const hash = PolyBcrypt.hash(password);
		const doesMatch = PolyBcrypt.verify(password, hash);
		expect(doesMatch).toBe(true);
	});
});

describe('PolyBcrypt.verify', () => {
	it('should verify passwords from js', () => {
		const doesMatch = PolyBcrypt.verify(password, fromJs);
		expect(doesMatch).toBe(true);
	});
	it('should reject strings that are too long', () => {
		const doesMatch = PolyBcrypt.verify(new Array(74).join('a'), fromJs);
		expect(doesMatch).toBe(false);
	});
	it('should verify passwords from php', () => {
		const doesMatch = PolyBcrypt.verify(password, fromPhp);
		expect(doesMatch).toBe(true);
	});
});

describe('PolyBcrypt.info()', () => {
	it('should parse hashes from js', () => {
		const actual = PolyBcrypt.info(fromJs);
		const expected = {
			valid: true,
			version: '$2a$',
			cost: 10,
			salt: 'f5449ok7vQOhhHwKwjZqx.',
			hash: 'cKeuroAr68DDwhxd78JUPJVqoVFqseS',
		};
		expect(actual).toEqual(expected);
	});

	it('should parse hashes from php', () => {
		const actual = PolyBcrypt.info(fromPhp);
		const expected = {
			valid: true,
			version: '$2y$',
			cost: 10,
			salt: 'npEa/T9.5/aR36tMgICKYu',
			hash: 'fSsReq9P9ioxV0cIpbB20KynjoYOz4.',
		};
		expect(actual).toEqual(expected);
	});

	it('should fail to parse invalid hash', () => {
		const actual = PolyBcrypt.info('$2a$10$0');
		const expected = {
			valid: false,
		};
		expect(actual).toEqual(expected);
	});
});
