import md from 'node-forge/lib/md.all';
import { SupportedDigestAlgos } from "./types";

/**
 * Calculate digests of strings
 */
const PolyDigest = {
	/**
	 * Calculate the md5 digest of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	md5(data: string): string {
		return PolyDigest._digest('md5', data);
	},

	/**
	 * Calculate the sha1 digest of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha1(data: string): string {
		return PolyDigest._digest('sha1', data);
	},

	/**
	 * Calculate the sha256 digest of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha256(data: string): string {
		return PolyDigest._digest('sha256', data);
	},

	/**
	 * Calculate the sha512 digest of a string
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 */
	sha512(data: string): string {
		return PolyDigest._digest('sha512', data);
	},

	/**
	 * Private function to calculate digests for the given algorithm
	 * @param {String} algo  An algorithm on the forge.md namespace
	 * @param {String} data  The string to digest
	 * @return {String} The digest in hexadecimal
	 * @private
	 */
	_digest(algo: SupportedDigestAlgos, data: string): string {
		const hash = md[algo].create();
		hash.update(data);
		return hash.digest().toHex();
	},
};

export default PolyDigest;
