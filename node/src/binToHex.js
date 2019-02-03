/**
 * Convert a binary string to hexadecimal
 * @see https://run.perf.zone/view/bin2hex-implementations-1548825552527
 * @param bin
 * @return {string}
 * @private
 */
export function binToHex(bin) {
	let output = '';
	for (let i = 0, len = bin.length; i < len; i++) {
		let hex = bin.charCodeAt(i).toString(16);
		output += hex.length === 1 ? '0' + hex : hex;
	}
	return output;
}
