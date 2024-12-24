#!/usr/bin/env node

import { PolyAES } from '../dist/index.cjs';

try {
	// usage: npx poly-aes decrypt <key> <ciphertext>
	const [, , key, ciphertext] = process.argv;
	const cipher = PolyAES.withKey(key);
	const plaintext = cipher.decrypt(ciphertext);
	process.stdout.write(plaintext);
} catch (e) {
	process.stderr.write(e.message);
	process.exit(1);
}
