const { PolyAES } = require('../../index.js');
const expect = require('chai').expect;

describe('PolyAES.withKey()', () => {
	const keyUpper = 'C639A572E14D5075C526FDDD43E4ECF6B095EA17783D32EF3D2710AF9F359DD4';
	const keyLower = 'c639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359dd4';
	const keyMixed = 'C639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359DD4';
	const key2 = 'E59DD4C639CF6B095EA17783D32EF3D2710ADD43E4F9F3A572E14D5075C526FD';
	const sheSellsDecrypted = 'She sells sea shells by the sea shore';
	const sheSellsEncrypted =
		'dOdjhDQkzxa+RS5HuafKdiUC9N20Hd58w1A26RVfanhvAgI5OkHDoWihExGDI1xNZ8d4eH3a0JzQZeGh9BTfNTEatrLr';

	it('should throw Error if key is not 64-char hex', () => {
		try {
			PolyAES.withKey('xyz');
			expect(false).to.equal(true);
		} catch (e) {
			expect(e).to.be.instanceOf(Error);
		}
	});

	it('should encrypt ok', () => {
		const crypto = PolyAES.withKey(keyUpper);
		const data = 'I love encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).to.equal(data);
	});

	it('should handle unicode', () => {
		const crypto = PolyAES.withKey(keyUpper);
		const data = 'I ❤️ encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).to.equal(data);
	});

	it('should encrypt differently every time', () => {
		const crypto = PolyAES.withKey(key2);
		const data = 'Pack my box with five dozen liquor jugs.';
		const encrypted1 = crypto.encrypt(data);
		const encrypted2 = crypto.encrypt(data);
		expect(encrypted1).to.not.equal(encrypted2);
	});

	it('should treat hexadecimal case insensitively', () => {
		const data = 'She sells sea shells by the sea shore';
		const encrypted = PolyAES.withKey(keyUpper).encrypt(data);
		const decrypted = PolyAES.withKey(keyLower).decrypt(encrypted);
		expect(decrypted).to.equal(data);

		const encrypted2 = PolyAES.withKey(keyLower).encrypt(data);
		const decrypted2 = PolyAES.withKey(keyMixed).decrypt(encrypted2);
		expect(decrypted2).to.equal(data);

		const encrypted3 = PolyAES.withKey(keyMixed).encrypt(data);
		const decrypted3 = PolyAES.withKey(keyUpper).decrypt(encrypted3);
		expect(decrypted3).to.equal(data);
	});

	it('should interoperate with Python and PHP', () => {
		const data = PolyAES.withKey(keyUpper).decrypt(sheSellsEncrypted);
		expect(data).to.equal(sheSellsDecrypted);
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
			expect(false).to.equal(true);
		} catch (e) {
			expect(e).to.be.instanceOf(Error);
		}
	});

	it('should encrypt ok', () => {
		const crypto = PolyAES.withPassword(password, salt);
		const data = 'I love encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).to.equal(data);
	});

	it('should handle unicode', () => {
		const crypto = PolyAES.withPassword(password, salt);
		const data = 'I ❤️ encryption';
		const encrypted = crypto.encrypt(data);
		const decrypted = crypto.decrypt(encrypted);
		expect(decrypted).to.equal(data);
	});

	it('should encrypt differently every time', () => {
		const crypto = PolyAES.withPassword(password, salt);
		const data = 'Pack my box with five dozen liquor jugs.';
		const encrypted1 = crypto.encrypt(data);
		const encrypted2 = crypto.encrypt(data);
		expect(encrypted1).to.not.equal(encrypted2);
	});

	it('should interoperate with Python and PHP', () => {
		const data = PolyAES.withPassword(password, salt).decrypt(sheSellsEncrypted);
		expect(data).to.equal(sheSellsDecrypted);
	});
});
