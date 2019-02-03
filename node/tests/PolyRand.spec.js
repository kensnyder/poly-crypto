const { PolyRand } = require('../../index.js');
const expect = require('chai').expect;

describe('PolyRand.bytes()', () => {
	it('should return requested size', () => {
		const hash = PolyRand.bytes(32);
		expect(hash.length).to.equal(32);
	});
});

describe('PolyRand.hex()', () => {
	it('should return requested size', () => {
		const hash = PolyRand.hex(32);
		expect(hash.length).to.equal(32);
	});
	it('should return only hex digits', () => {
		const hash = PolyRand.hex(42);
		expect(hash).to.match(/^[a-f0-9]{42}$/i);
	});
});

describe('PolyRand.slug()', () => {
	it('should return requested size', () => {
		const hash = PolyRand.slug(11);
		expect(hash.length).to.equal(11);
	});
	it('should return letters, numbers but no vowels', () => {
		const hash = PolyRand.slug(2000);
		expect(hash).to.match(/^[a-z0-9]{2000}$/i);
		expect(hash).not.to.match(/[aeiou]/i);
	});
});

describe('PolyRand.fax()', () => {
	it('should return requested size', () => {
		const hash = PolyRand.fax(101);
		expect(hash.length).to.equal(101);
	});
	it('should return the proper symbol list', () => {
		const hash = PolyRand.fax(2000);
		expect(hash).to.match(/^[3467bcdfhjkmnpqrtvwxy]{2000}$/i);
	});
});

describe('PolyRand.string()', () => {
	it('should throw error if symbol list is too short', () => {
		try {
			PolyRand.string(101, ['a']);
			expect(false).to.equal(true);
		} catch (e) {
			expect(true).to.equal(true);
		}
	});
	it('should return requested size', () => {
		const hash = PolyRand.string(101, ['a', 'b', 'c']);
		expect(hash.length).to.equal(101);
	});
	it('should return the proper symbol list', () => {
		const hash = PolyRand.string(200, ['a', 'b', 'c']);
		expect(hash).to.match(/^[abc]{200}$/i);
	});
});
