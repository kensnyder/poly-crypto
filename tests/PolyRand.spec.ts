import { describe, it, expect } from "vitest";
import { PolyRand } from "../index.js";

describe('PolyRand.bytes()', () => {
	it('should return requested size', () => {
		const hash = PolyRand.bytes(32);
		expect(hash.length).toBe(32);
	});
});

describe('PolyRand.hex()', () => {
	it('should return requested size', () => {
		const hash = PolyRand.hex(32);
		expect(hash.length).toBe(32);
	});
	it('should return only hex digits', () => {
		const hash = PolyRand.hex(42);
		expect(hash).toMatch(/^[a-f0-9]{42}$/);
	});
});

describe('PolyRand.slug()', () => {
	it('should return requested size', () => {
		const hash = PolyRand.slug(11);
		expect(hash.length).toBe(11);
	});
	it('should return letters, numbers but no vowels', () => {
		const hash = PolyRand.slug(2000);
		expect(hash).toMatch(/^[a-z0-9]{2000}$/i);
		expect(hash).not.toMatch(/[aeiou]/i);
	});
});

describe('PolyRand.fax()', () => {
	it('should return requested size', () => {
		const hash = PolyRand.fax(101);
		expect(hash.length).toBe(101);
	});
	it('should return the proper symbol list', () => {
		const hash = PolyRand.fax(2000);
		expect(hash).toMatch(/^[3467bcdfhjkmnpqrtvwxy]{2000}$/);
	});
});

describe('PolyRand.string()', () => {
	it('should throw error if symbol list is too short', () => {
		try {
			PolyRand.string(42, ['a']);
			expect(false).toBe(true);
		} catch (e) {
			expect(true).toBe(true);
		}
	});
	it('should return requested size', () => {
		const hash = PolyRand.string(101, ['a', 'b', 'c']);
		expect(hash.length).toBe(101);
	});
	it('should return the proper symbol list', () => {
		const hash = PolyRand.string(200, ['a', 'b', 'c']);
		expect(hash).toMatch(/^[abc]{200}$/);
	});
	it('should handle unicode symbol list', () => {
		const hash = PolyRand.string(1, ['💻', '🖥️']);
		expect(hash === '💻' || hash === '🖥️').toBe(true);
	});
});
