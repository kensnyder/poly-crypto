#!/usr/bin/env node

const { PolyRand } = require('../index.js');

try {
	const [, , length, symbols] = process.argv;
	const out = PolyRand.string(Number(length), symbols.split(''));
	process.stdout.write(out);
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
