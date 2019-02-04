#!/usr/bin/env node

const { PolyRand } = require('../../index.js');

try {
	const length = process.argv[2];
	const symbols = process.argv[3];
	const out = PolyRand.string(length, symbols.split(''));
	process.stdout.write(out);
} catch (e) {
	process.exit(1);
}
