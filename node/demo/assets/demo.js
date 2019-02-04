import { PolyAES } from '../../src/PolyAES.js';
import { PolyBcrypt } from '../../src/PolyBcrypt.js';
import { PolyHash } from '../../src/PolyHash.js';
import { PolyRand } from '../../src/PolyRand.js';

window.keygen = function(inputId) {
	const input = document.querySelector(`#${inputId}`);
	input.value = PolyAES.generateKey();
};

window.keyEncrypt = function() {
	const key = document.querySelector('#aes-key').value;
	const data = document.querySelector('#aes-key-plaintext').value;
	const outputEl = document.querySelector('#aes-key-encrypted');
	try {
		const encrypted = PolyAES.withKey(key).encrypt(data);
		outputEl.textContent = encrypted;
	} catch (e) {
		outputEl.textContent = `ERROR: ${e.message}`;
	}
};

window.keyDecrypt = function() {
	const key = document.querySelector('#aes-key').value;
	const data = document.querySelector('#aes-key-ciphertext').value;
	const outputEl = document.querySelector('#aes-key-decrypted');
	try {
		const encrypted = PolyAES.withKey(key).decrypt(data);
		outputEl.textContent = encrypted;
	} catch (e) {
		outputEl.textContent = `ERROR: ${e.message}`;
	}
};

function qsa(selector, root) {
	const nodes = (root || document).querySelectorAll(selector);
	return [...nodes];
}
