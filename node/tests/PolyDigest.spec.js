const { PolyDigest } = require('../../index.js');
const expect = require('chai').expect;

describe('PolyDigest', () => {
	it('should run md5 properly', () => {
		const digest = PolyDigest.md5('digest me');
		expect(digest).to.equal('5a5f31530e5b9571d9353ae3f4e6c76d');
	});
});
