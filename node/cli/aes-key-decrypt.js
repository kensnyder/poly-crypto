#!/usr/bin/env node

const { PolyAES } = require('../../index.js');

try {
	const cipher = PolyAES.withKey(process.argv[2]);
	const encrypted = cipher.encrypt(process.argv[3]);
	process.stdout.write(encrypted);
} catch (e) {
	process.exit(1);
}
