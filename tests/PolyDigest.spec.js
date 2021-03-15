const { PolyDigest } = require('../index.js');

describe('PolyDigest', () => {
	it('should run md5 properly', () => {
		const digest = PolyDigest.md5('digest me');
		expect(digest).toBe('5a5f31530e5b9571d9353ae3f4e6c76d');
	});
	it('should run sha1 properly', () => {
		const digest = PolyDigest.sha1('digest me');
		expect(digest).toBe('f182cb6b0fa5df0150bc9ce4a88769c66fc6cdeb');
	});
	it('should run sha256 properly', () => {
		const digest = PolyDigest.sha256('digest me');
		expect(digest).toBe('a230eb9c90aa2a2e9cc1286fd505a348beae8cb74730255608db9284e2f7cef5');
	});
	it('should run sha512 properly', () => {
		const digest = PolyDigest.sha512('digest me');
		expect(digest).toBe(
			'b2512ca0339783a8868edc928ba132715a84c33b81778420f9be1fdae33554c95b1f01a7abcc600ba2e5250568f2b6e71e393a626aa440dfcc572c62476af45a'
		);
	});
});
