#!/usr/bin/env node

const { PolyBcrypt } = require('../dist/index.cjs');

try {
	const [, , password, cost] = process.argv;
	const hash = PolyBcrypt.hash(password, cost);
	process.stdout.write(hash);
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
