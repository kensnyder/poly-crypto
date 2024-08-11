import { describe, expect, it } from 'vitest';
import { PolyAES } from '../src';

describe('PolyAES.withKey()', () => {
	const keyUpper = 'C639A572E14D5075C526FDDD43E4ECF6B095EA17783D32EF3D2710AF9F359DD4';
	const keyLower = 'c639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359dd4';
	const keyMixed = 'C639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359DD4';
	const key2 = 'E59DD4C639CF6B095EA17783D32EF3D2710ADD43E4F9F3A572E14D5075C526FD';
	const sheSellsDecrypted = 'She sells sea shells by the sea shore';
	const sheSellsEncrypted =
		'dOdjhDQkzxa+RS5HuafKdiUC9N20Hd58w1A26RVfanhvAgI5OkHDoWihExGDI1xNZ8d4eH3a0JzQZeGh9BTfNTEatrLr';

	it('should throw Error if key is not 64-char hex', () => {
		const thrower = () => PolyAES.withKey('xyz');
		expect(thrower).toThrow();
	});

	it('should encrypt ok', () => {
		const crypto = PolyAES.withKey(keyUpper);
		const data = 'I love encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).toBe(data);
	});

	it('should handle unicode', () => {
		const crypto = PolyAES.withKey(keyUpper);
		const data = 'I ❤️ encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).toBe(data);
	});

	it('should encrypt differently every time', () => {
		const crypto = PolyAES.withKey(key2);
		const data = 'Pack my box with five dozen liquor jugs.';
		const encrypted1 = crypto.encrypt(data);
		const encrypted2 = crypto.encrypt(data);
		expect(encrypted1).not.toBe(encrypted2);
	});

	it('should treat hexadecimal case insensitively', () => {
		const data = 'She sells sea shells by the sea shore';
		const encrypted = PolyAES.withKey(keyUpper).encrypt(data);
		const decrypted = PolyAES.withKey(keyLower).decrypt(encrypted);
		expect(decrypted).toBe(data);

		const encrypted2 = PolyAES.withKey(keyLower).encrypt(data);
		const decrypted2 = PolyAES.withKey(keyMixed).decrypt(encrypted2);
		expect(decrypted2).toBe(data);

		const encrypted3 = PolyAES.withKey(keyMixed).encrypt(data);
		const decrypted3 = PolyAES.withKey(keyUpper).decrypt(encrypted3);
		expect(decrypted3).toBe(data);
	});

	it('should interoperate with PHP', () => {
		const data = PolyAES.withKey(keyUpper).decrypt(sheSellsEncrypted);
		expect(data).toBe(sheSellsDecrypted);
	});

	it('should interoperate with PHP (No Buffer)', () => {
		globalThis.POLY_CRYPTO_TEST_WITHOUT_BUFFER = true;
		const data = PolyAES.withKey(keyUpper).decrypt(sheSellsEncrypted);
		expect(data).toBe(sheSellsDecrypted);
		const encrypted = PolyAES.withKey(keyUpper).encrypt(data);
		const decrypted = PolyAES.withKey(keyLower).decrypt(encrypted);
		expect(decrypted).toBe(data);
		globalThis.POLY_CRYPTO_TEST_WITHOUT_BUFFER = false;
	});

	it('should interoperate with PHP (No TextEncoder)', () => {
		globalThis.POLY_CRYPTO_TEST_WITHOUT_BUFFER = true;
		globalThis.POLY_CRYPTO_TEST_WITHOUT_TEXTENCODER = true;
		const data = PolyAES.withKey(keyUpper).decrypt(sheSellsEncrypted);
		expect(data).toBe(sheSellsDecrypted);
		const encrypted = PolyAES.withKey(keyUpper).encrypt(data);
		const decrypted = PolyAES.withKey(keyLower).decrypt(encrypted);
		expect(decrypted).toBe(data);
		globalThis.POLY_CRYPTO_TEST_WITHOUT_BUFFER = false;
		globalThis.POLY_CRYPTO_TEST_WITHOUT_TEXTENCODER = false;
	});

	it('should interoperate with PHP (No TextDecoder)', () => {
		globalThis.POLY_CRYPTO_TEST_WITHOUT_BUFFER = true;
		globalThis.POLY_CRYPTO_TEST_WITHOUT_TEXTDECODER = true;
		const encrypted = PolyAES.withKey(keyUpper).encrypt(sheSellsDecrypted);
		const decrypted = PolyAES.withKey(keyLower).decrypt(encrypted);
		expect(decrypted).toBe(sheSellsDecrypted);
		globalThis.POLY_CRYPTO_TEST_WITHOUT_BUFFER = false;
		globalThis.POLY_CRYPTO_TEST_WITHOUT_TEXTDECODER = false;
	});
});

describe('PolyAES.withPassword()', () => {
	const password = 'The quick brown fox jumped over the lazy dog';
	const salt = 'Four score and seven years ago';
	const sheSellsDecrypted = 'She sells sea shells by the sea shore';
	const sheSellsEncrypted =
		'R7k/YWDFEGiZ1q0m0Azlf1CUjunSrHBvCrrdRfG/YGi79tM1BagDn1rBsurZcEAhFNvvV7yVZgJ/RR2D7X/P9xOQt+XI';

	it('should throw exception if password is shorter than 8 characters', () => {
		try {
			PolyAES.withPassword(password, 'hello w');
			expect(false).toBe(true);
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
		}
	});

	it('should encrypt ok', () => {
		const crypto = PolyAES.withPassword(password, salt);
		const data = 'I love encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).toBe(data);
	});

	it('should handle unicode', () => {
		const crypto = PolyAES.withPassword(password, salt);
		const data = 'I ❤️ encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).toBe(data);
	});

	it('should encrypt differently every time', () => {
		const crypto = PolyAES.withPassword(password, salt);
		const data = 'Pack my box with five dozen liquor jugs.';
		const encrypted1 = crypto.encrypt(data);
		const encrypted2 = crypto.encrypt(data);
		expect(encrypted1).not.toBe(encrypted2);
	});

	it('should interoperate with PHP', () => {
		const data = PolyAES.withPassword(password, salt).decrypt(sheSellsEncrypted);
		expect(data).toBe(sheSellsDecrypted);
	});
});

describe('PolyAES.setEncoding()', () => {
	const keyUpper = 'C639A572E14D5075C526FDDD43E4ECF6B095EA17783D32EF3D2710AF9F359DD4';
	it('should throw error if encoding is invalid', () => {
		// @ts-expect-error  Testing invalid input
		const thrower = () => PolyAES.withKey(keyUpper).setEncoding('xyz');
		expect(thrower).toThrow();
	});
	it('should default to base64', () => {
		const crypto = PolyAES.withKey(keyUpper);
		expect(crypto.getEncoding()).toBe('base64');
	});
	it('should set encoding to hex', () => {
		const crypto = PolyAES.withKey(keyUpper).setEncoding('hex');
		expect(crypto.getEncoding()).toBe('hex');
	});
	it('should set encoding to bin', () => {
		const crypto = PolyAES.withKey(keyUpper).setEncoding('bin');
		expect(crypto.getEncoding()).toBe('bin');
	});

	it('should support hex encoding', () => {
		const crypto = PolyAES.withKey(keyUpper).setEncoding('hex');
		const data = 'I ❤️ encryption';
		const encrypted = crypto.encrypt(data);
		expect(encrypted).toMatch(/^[a-f0-9]+$/);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).toBe(data);
	});

	it('should support bin encoding', () => {
		const crypto = PolyAES.withKey(keyUpper).setEncoding('bin');
		const data = 'I ❤️ encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).toBe(data);
	});
});

describe('PolyAES.generateKey()', () => {
	it('should generate key ok', () => {
		const key = PolyAES.generateKey();
		expect(key).toMatch(/^[a-f0-9]{64}$/);
	});
	it('should generate key with specified length', () => {
		const key = PolyAES.generateKey(128);
		expect(key).toMatch(/^[a-f0-9]{128}$/);
	});
});

describe('PolyAES.generateSalt()', () => {
	it('should generate key ok', () => {
		const key = PolyAES.generateSalt();
		expect(key).toMatch(/^[a-f0-9]{64}$/);
	});
	it('should generate key with specified length', () => {
		const key = PolyAES.generateSalt(128);
		expect(key).toMatch(/^[a-f0-9]{128}$/);
	});
});
