const { PolyBcrypt } = require('../../index.js');
const expect = require('chai').expect;

const fromPhp = '$2y$10$npEa/T9.5/aR36tMgICKYufSsReq9P9ioxV0cIpbB20KynjoYOz4.';
const fromPython = '$2a$12$GZJDKqVrXLi0JWdhWZ55EuCb7tKoMINe3Z/RrFFIbQpG3sW8sR7qu';

describe('PolyBcrypt.hash', () => {
	it('should ensure cost is at least 4', () => {
		const longPassword =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ok?';
		try {
			PolyBcrypt.hash(longPassword);
			expect(false).to.equal(true);
		} catch (e) {
			expect(e).to.be.instanceOf(Error);
		}
	});
	it('should ensure cost is at least 4', () => {
		try {
			PolyBcrypt.hash('abc', 3);
			expect(false).to.equal(true);
		} catch (e) {
			expect(e).to.be.instanceOf(Error);
		}
	});
	it('should ensure cost is at most 31', () => {
		try {
			PolyBcrypt.hash('abc', 32);
			expect(false).to.equal(true);
		} catch (e) {
			expect(e).to.be.instanceOf(Error);
		}
	});
	it('should produce 60 char string', () => {
		const hash = PolyBcrypt.hash('abc');
		expect(hash.length).to.equal(60);
	});
	it('should handle unicode', () => {
		const hash = PolyBcrypt.hash('Ich weiß nicht 🔥. Bitte schön.', 10);
		expect(hash).to.match(/^\$\d[a-z]\$10\$[\w.\/]{53}$/);
	});
});

describe('PolyBcrypt.verify', () => {
	it('should verify a php hash', () => {
		const doesMatch = PolyBcrypt.verify('abc', fromPhp);
		expect(doesMatch).to.equal(true);
	});
	it('should verify a python hash', () => {
		const doesMatch = PolyBcrypt.verify('abc', fromPython);
		expect(doesMatch).to.equal(true);
	});
});
