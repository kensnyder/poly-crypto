const PolyAES = require('../../index.js').default;
const expect = require('chai').expect;

const password = 'The quick brown fox jumped over the lazy dog';
const salt = 'Four score and seven years ago';
const sheSellsDecrypted = 'She sells sea shells by the sea shore';
const sheSellsEncrypted =
	'R7k/YWDFEGiZ1q0m0Azlf1CUjunSrHBvCrrdRfG/YGi79tM1BagDn1rBsurZcEAhFNvvV7yVZgJ/RR2D7X/P9xOQt+XI';

describe('PolyAES.withPassword', () => {
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
