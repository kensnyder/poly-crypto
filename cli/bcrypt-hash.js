#!/usr/bin/env node

const { PolyBcrypt } = require('../../index.js');

try {
	const [$0, $1, password, cost] = process.argv;
	const hash = PolyBcrypt.hash(password, cost);
	process.stdout.write(hash);
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
