#!/usr/bin/env node

const { PolyAES } = require('../index.js');

try {
	const [, , password, salt, ciphertext] = process.argv;
	const cipher = PolyAES.withPassword(password, salt);
	const encrypted = cipher.encrypt(ciphertext);
	process.stdout.write(encrypted);
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
