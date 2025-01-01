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
		expect(thrower).toThrowError('Invalid digit "2" for fromBase 2');
	});
});

describe('new PolyConvert().fromBytes()', () => {
	it('should handle 1', () => {
		const input = new Uint8Array([1]);
		const result = new PolyConvert().fromBytes(input, 62);
		expect(result).toBe('1');
	});
	it('should handle 61', () => {
		const input = new Uint8Array([61]);
		const result = new PolyConvert().fromBytes(input, 62);
		expect(result).toBe('z');
	});
	it('should handle 62', () => {
		const input = new Uint8Array([62]);
		const result = new PolyConvert().fromBytes(input, 62);
		expect(result).toBe('10');
	});
	it('should handle 3 values', () => {
		const input = new Uint8Array([1, 128, 255]);
		const result = new PolyConvert().fromBytes(input, 62);
		expect(result).toBe('Pdf');
	});
	it('should handle encoded text', () => {
		const input = new TextEncoder().encode('Hello ☀️');
		const result = new PolyConvert().fromBytes(input, 62);
		expect(result).toBe('T8dgcjRHS0rAkIBD');
	});
});

describe('new PolyConvert().toBytes()', () => {
	it('should handle 1', () => {
		const input = '1';
		const result = new PolyConvert().toBytes(input, 62);
		expect(result).toEqual(new Uint8Array([1]));
	});
	it('should handle 61', () => {
		const input = 'z';
		const result = new PolyConvert().toBytes(input, 62);
		expect(result).toEqual(new Uint8Array([61]));
	});
	it('should handle 62', () => {
		const input = '10';
		const result = new PolyConvert().toBytes(input, 62);
		expect(result).toEqual(new Uint8Array([62]));
	});
	it('should handle 3 values', () => {
		const input = 'Pdf';
		const result = new PolyConvert().toBytes(input, 62);
		expect(result).toEqual(new Uint8Array([1, 128, 255]));
	});
	it('should handle encoded text', () => {
		const input = 'T8dgcjRHS0rAkIBD';
		const result = new PolyConvert().toBytes(input, 62);
		expect(result).toEqual(new TextEncoder().encode('Hello ☀️'));
	});
});

describe('PolyConvert.base()', () => {
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
		{ args: ['ZZ', 62, 94], result: 'Nh' },
		{ args: ['JavaScript_Rocks!', 92, 10], result: '510933176934557210798603247955210' },
		{ args: ['And_TypeScript_too!', 92, 62], result: '3KlBTupBB5PRF9AchQBHm' },
		{ args: ['18446744073709551615', 10, 16], result: 'FFFFFFFFFFFFFFFF' },
		{ args: ['18446744073709551615', 10, 62], result: 'LygHa16AHYF' },
		{ args: ['kendsnyder', 62, 36], result: '4SR4ME79DEEP' },
		{ args: [BigInt('123456789012345678901234567890'), 10, 92], result: 'dz_(#U&v+a#uXnc' },
	];
	for (const spec of specs) {
		it(`should handle converting "${spec.args[0]}" from base ${spec.args[1]} to base ${spec.args[2]}`, () => {
			// @ts-expect-error  I'm not going to bother to type specs
			const result = PolyConvert.base(spec.args[0], spec.args[1], spec.args[2]);
			expect(result).toBe(spec.result);
		});
	}
});

describe('PolyConvert presets', () => {
	it('should support PolyConvert.fromFax', () => {
		const result = PolyConvert.fromFax('467bcdfhjkmnpqrtvwxy', 10);
		expect(result).toBe('14606467545964956303452810');
	});
	it('should support PolyConvert.toFax', () => {
		const result = PolyConvert.toFax('14606467545964956303452810', 10);
		expect(result).toBe('467bcdfhjkmnpqrtvwxy');
	});
	it('should support PolyConvert.from64', () => {
		const result = PolyConvert.from64('BCDEFGHIJKLMNOP', 10);
		expect(result).toBe('19961744145695222371767183');
	});
	it('should support PolyConvert.to64', () => {
		const result = PolyConvert.to64('19961744145695222371767183', 10);
		expect(result).toBe('BCDEFGHIJKLMNOP');
	});
	it('should support PolyConvert.fromSlug', () => {
		const result = PolyConvert.fromSlug(
			'123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ',
			10
		);
		expect(result).toBe(
			'65619590647494106872079167509227825748311557976153772654499440883483291755167717380843'
		);
	});
	it('should support PolyConvert.toSlug', () => {
		const result = PolyConvert.toSlug(
			'65619590647494106872079167509227825748311557976153772654499440883483291755167717380843',
			10
		);
		expect(result).toBe('123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ');
	});
	it('should support PolyConvert.toSlug/fromSlug on base 16', () => {
		const result = PolyConvert.toSlug('908af273ca23bd1fdd5e166be5a234b83d6bb332', 16);
		expect(result).toBe('KppGKv5wKYb46vJkFWQcGFMkV5CF');
		const back = PolyConvert.fromSlug(result, 16);
		expect(back).toBe('908AF273CA23BD1FDD5E166BE5A234B83D6BB332');
	});
});

describe('PolyConvert trivial cases', () => {
	it('should handle 0n', () => {
		const input = new Uint8Array([0]);
		const result = new PolyConvert().fromBytes(input, 10);
		expect(result).toBe('0');
	});
	it('should throw on invalid character', () => {
		const thrower = () => {
			const input = 'a';
			const result = new PolyConvert().toBytes(input, 10);
		};
		expect(thrower).toThrowError();
	});
});

describe('PolyConvert.substitute()', () => {
	it('should handle rot13 transformation', () => {
		const input = 'hello';
		const from = 'abcdefghijklmnopqrstuvwxyz';
		const toit = 'zyxwvutsrqponmlkjihgfedcba';
		const result = PolyConvert.substitute(input, from, toit);
		expect(result).toBe('svool');
	});
	it('should handle have dedicated rot13() function', () => {
		const input = 'Hello';
		const result = PolyConvert.rot13(input);
		expect(result).toBe('Svool');
	});
	it('should ignore unknown characters', () => {
		const input = 'hello!';
		const from = 'abcdefghijklmnopqrstuvwxyz';
		const toit = 'zyxwvutsrqponmlkjihgfedcba';
		const result = PolyConvert.substitute(input, from, toit);
		expect(result).toBe('svool!');
	});
	// see https://en.wikipedia.org/wiki/Duodecimal
	it('should support multi-byte input', () => {
		const input = '1\u218A\u218B';
		const from = '0123456789\u218A\u218B';
		const toit = '0123456789AB';
		const result = PolyConvert.substitute(input, from, toit);
		expect(result).toBe('1AB');
	});
	it('should support multi-byte output', () => {
		const input = '1AB';
		const from = '0123456789AB';
		const toit = '0123456789\u218A\u218B';
		const result = PolyConvert.substitute(input, from, toit);
		expect(result).toBe('1\u218A\u218B');
	});
});
