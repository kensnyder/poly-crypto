#!/usr/bin/env node

const { PolyAES } = require('../../index.js');

try {
	const cipher = PolyAES.withPassword(process.argv[2], process.argv[3]);
	const encrypted = cipher.encrypt(process.argv[4]);
	process.stdout.write(encrypted);
} catch (e) {
	process.exit(1);
}
