import { describe, expect, it } from 'vitest';
import PolyConvert from '../src/PolyConvert';

describe('PolyConvert exceptions', () => {
	it('should fail on base 1', () => {
		const thrower = () => PolyConvert.base('1011', 1, 10);
		expect(thrower).toThrowError('Base must be between 2 and 95');
	});
	it('should fail on invalid base', () => {
		// @ts-expect-error  Testing invalid input
		const thrower = () => PolyConvert.base('1011', 'a', 10);
		expect(thrower).toThrowError('Base must be between 2 and 95');
	});
	it('should fail on empty', () => {
		const thrower = () => PolyConvert.base('', 2, 10);
		expect(thrower).toThrowError('Input number cannot be empty');
	});
	it('should fail on invalid digit', () => {
		const thrower = () => PolyConvert.base('12', 2, 10);
		expect(thrower).toThrowError('Invalid digit "2" for base 2');
	});
});

describe('PolyConvert.convert()', () => {
	const specs = [
		{ args: [11, 10, 10], result: '11' },
		{ args: [11, 10, 2], result: '1011' },
		{ args: ['1011', 2, 10], result: '11' },
		{ args: ['ff', 16, 10], result: '255' },
		{ args: ['FF', 16, 10], result: '255' },
		{ args: ['ee', 15, 16], result: 'E0' },
		{ args: ['EE', 15, 16], result: 'E0' },
		{ args: ['Ee', 15, 16], result: 'E0' },
		{ args: ['zz', 36, 10], result: '1295' },
		{ args: ['ZZ', 36, 10], result: '1295' },
		// for high bases, see: https://jalu.ch/coding/base_converter.php
		{ args: ['ZZ', 62, 94], result: 'E:' },
		{ args: ['JavaScript_Rocks!', 92, 10], result: '1188231054825008491419286819780752' },
		{ args: ['And_TypeScript_too!', 92, 62], result: 'btjYsDwwuWrElSt7WRf2g' },
		{ args: ['18446744073709551615', 10, 16], result: 'FFFFFFFFFFFFFFFF' },
		{ args: ['18446744073709551615', 10, 62], result: 'lYGhA16ahyf' },
		{ args: ['kendsnyder', 42, 36], result: '29h0lkc04u3' },
		{ args: [BigInt('123456789012345678901234567890'), 10, 92], result: 'DZ=_%u(V`A%UxNC' },
	];
	for (const spec of specs) {
		it(`should handle converting "${spec.args[0]}" from base ${spec.args[1]} to base ${spec.args[2]}`, () => {
			// @ts-expect-error  I'm not going to bother to type specs
			const result = PolyConvert.base(spec.args[0], spec.args[1], spec.args[2]);
			expect(result).toBe(spec.result);
		});
	}
});

describe('PolyConvert.withAlphabet()', () => {
	// for custom alphabets, see: https://jalu.ch/coding/base_converter.php
	it('should handle custom alphabet', () => {
		const alphabet = 'custom'.split('');
		const converter = PolyConvert.withAlphabet(alphabet);
		const result = converter.applyBase('tom', 6, 5);
		expect(result).toBe('UCSS');
	});
	it('should support PolyConvert.slug', () => {
		const result = PolyConvert.slug.applyBase(
			'0123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ',
			52,
			36
		);
		expect(result).toBe('1rxxcgff2s44lsmpCcqtqF9p9vDDd67Bvgpqtlnw3ltFpq4r53m6grGh');
	});
	it('should support PolyConvert.fax', () => {
		const result = PolyConvert.fax.applyBase('3467bcdfhjkmnpqrtvwxy', 21, 10);
		expect(result).toBe('4BD3DBDFCBCJDBJCD737BC6H43');
	});
	it('should support PolyConvert.fax', () => {
		const result = PolyConvert.fax.applyBase('4BD3DBDFCBCJDBJCD737BC6H43', 10, 21);
		expect(result).toBe('467BCDFHJKMNPQRTVWXY');
	});
});
