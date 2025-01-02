#!/usr/bin/env node

const { PolyAES } = require('../dist/index.cjs');

try {
	const [, , password, salt, ciphertext] = process.argv;
	const cipher = PolyAES.withPassword(password, salt);
	const plaintext = cipher.decrypt(ciphertext);
	process.stdout.write(plaintext);
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
