#!/usr/bin/env node

const { PolyBcrypt } = require('../dist/index.cjs');

try {
	const [, , password, hash] = process.argv;
	const doesMatch = PolyBcrypt.verify(password, hash);
	process.stdout.write(doesMatch ? '1' : '0');
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
