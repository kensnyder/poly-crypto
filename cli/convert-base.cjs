#!/usr/bin/env node

const { PolyConvert } = require('../dist/index.cjs');

try {
	const [, , input, from, to] = process.argv;
	const out = PolyConvert.base(input, from, to);
	process.stdout.write(out);
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
