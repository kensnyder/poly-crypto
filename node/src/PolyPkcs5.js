import forge from 'node-forge';

export const PolyPkcs5 = {
	hash(password) {
		const numIterations = 100000;
		const salt = forge.random.getBytesSync(128);
		const key = forge.pkcs5.pbkdf2(password, salt, numIterations, 16);
		return forge.util.bytesToHex(salt) + forge.util.bytesToHex(key);
	},

	verify(password, hash) {
		const numIterations = 100000;
		const salt = forge.util.hexToBytes(hash.slice(0, 64));
		const key = forge.util.hexToBytes(hash.slice(64));
		const digest = forge.pkcs5.pbkdf2(password, salt, numIterations, 16); // sha256 ?
		return digest === key;
	},
};
