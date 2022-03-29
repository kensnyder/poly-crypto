#!/usr/bin/env node

const { PolyAES } = require('../index.js');

try {
	const [, , key, plaintext] = process.argv;
	const cipher = PolyAES.withKey(key);
	const ciphertext = cipher.encrypt(plaintext);
	process.stdout.write(ciphertext);
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
