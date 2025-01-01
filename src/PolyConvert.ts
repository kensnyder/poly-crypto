/**
 * Default alphabets for substitution
 */
export const alphabets = {
	standard:
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/`~!@#$%^&*()_={}|[]\\:";\'<>?,-. ',
	base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
	slug: '0123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ',
	fax: '3467bcdfhjkmnpqrtvwxy',
};

/**
 * Class to convert numbers between bases using arbitrary alphabets
 */
export default class PolyConvert {
	/**
	 * Error message when base is invalid
	 */
	BASE_ERROR = 'Base must be between 2 and %s';

	/**
	 * Error message when input is empty
	 */
	EMPTY_ERROR = 'Input number cannot be empty';

	/**
	 * Error message when input digit is invalid
	 */
	INVALID_DIGIT_ERROR = 'Invalid digit "%s" for fromBase %s';

	/**
	 * The alphabet to use for conversion
	 */
	alphabet: string;

	/**
	 * Create a new PolyConvert instance given an alphabet
	 * @param alphabet
	 */
	constructor(alphabet = alphabets.standard) {
		this.alphabet = alphabet;
	}

	/**
	 * Ensure that the string number has both upper and lower case characters
	 * @param digits  The string base
	 * @param maxBase  The base that will be used for conversion
	 */
	ensureCasing = (digits: string, maxBase: number) => {
		const str = this.alphabet.slice(0, maxBase);
		if (/[a-z]/.test(str) && /[A-Z]/.test(str)) {
			return digits;
		}
		return digits.toUpperCase();
	};

	/**
	 * Validate the fromBase abd toBase values are within the alphabet range
	 * @param fromBase  Must be between 2 and the alphabet length
	 * @param toBase Must be between 2 and the alphabet length
	 * @throws Error  If fromBase or toBase are invalid
	 */
	validateBase = (fromBase: number, toBase: number) => {
		fromBase = Number(fromBase);
		toBase = Number(toBase);

		const maxBase = Math.max(fromBase, toBase, this.alphabet.length) || this.alphabet.length;

		// Base validation
		if (
			fromBase < 2 ||
			fromBase > maxBase ||
			toBase < 2 ||
			toBase > maxBase ||
			isNaN(fromBase) ||
			isNaN(toBase)
		) {
			throw new Error(this.BASE_ERROR.replace('%s', String(maxBase)));
		}
	};

	/**
	 * Convert an array of BigInt digits from one base to another
	 * @param bigintDigits  The input array of BigInt digits
	 * @param fromBase  The input's base
	 * @param toBase  The output's base
	 */
	convertArray = (bigintDigits: bigint[], fromBase: number, toBase: number) => {
		if (bigintDigits.length === 0) {
			throw new Error(this.EMPTY_ERROR);
		}

		const bigintFromBase = BigInt(fromBase);
		const bigintToBase = BigInt(toBase);

		let result = [0n];

		if (bigintDigits.length === 1 && bigintDigits[0] === 0n) {
			// shortcut trivial case
			return result;
		}

		// Process each digit
		for (const digit of bigintDigits) {
			// Multiply current result by source base and add new digit
			let carry = digit;
			for (let i = 0; i < result.length; i++) {
				const product = result[i] * bigintFromBase + carry;
				result[i] = product % bigintToBase;
				carry = product / bigintToBase;
			}

			// Add any remaining carry digits
			while (carry > 0n) {
				result.push(carry % bigintToBase);
				carry = carry / bigintToBase;
			}
		}

		return result.reverse();
	};

	/**
	 * Convert a number from one base to another
	 * @param input  The number to convert
	 * @param fromBase  The input's base
	 * @param toBase  The output's base
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	applyBase = (input: string | number | BigInt, fromBase: number, toBase: number) => {
		input = String(input);
		fromBase = Number(fromBase);
		toBase = Number(toBase);

		this.validateBase(fromBase, toBase);

		if (fromBase >= 2 && fromBase === toBase) {
			// shortcut trivial case
			return input;
		}

		// Normalize small alphabets to uppercase
		const digits = this.ensureCasing(input, fromBase);

		// Convert input string to array of digit values
		const bigIntDigits: bigint[] = [];
		for (const char of digits) {
			const digit = this.alphabet.indexOf(char);
			if (digit === -1 || digit >= fromBase) {
				throw new Error(
					this.INVALID_DIGIT_ERROR.replace('%s', char).replace('%s', String(fromBase))
				);
			}
			bigIntDigits.push(BigInt(digit));
		}

		// Convert using core function
		const result = this.convertArray(bigIntDigits, fromBase, toBase);

		// Convert result back to string using alphabet
		const mapped = result.map(digit => this.alphabet[Number(digit)]).join('');

		// Normalize small alphabets to uppercase
		return this.ensureCasing(mapped, toBase);
	};

	/**
	 * Convert a Uint8Array to a string number
	 * @param input  The incoming Uint8Array
	 * @param toBase  The base to convert to
	 * @throws Error  If target base is invalid
	 */
	fromBytes = (input: Uint8Array, toBase: number) => {
		this.validateBase(2, toBase);

		// Convert input bytes to array of BigInt values
		const digits = Array.from(input).map(byte => BigInt(byte));

		// Convert using core function
		const result = this.convertArray(digits, 256, toBase);

		// Convert result back to string using alphabet
		return result.map(digit => this.alphabet[Number(digit)]).join('');
	};

	/**
	 * Convert a string number to a Uint8Array
	 * @param input  The incoming string number
	 * @param fromBase  The base of the incoming number
	 * @throws Error  If incoming number base is invalid
	 */
	toBytes = (input: string, fromBase: number) => {
		this.validateBase(fromBase, 256);

		// Normalize small alphabets to uppercase
		const digits = this.ensureCasing(input, fromBase);

		// Convert input string to array of digit values
		const bigIntDigits: bigint[] = [];
		for (const char of digits) {
			const digit = this.alphabet.indexOf(char);
			if (digit === -1 || digit >= fromBase) {
				throw new Error(
					this.INVALID_DIGIT_ERROR.replace('%s', char).replace('%s', String(fromBase))
				);
			}
			bigIntDigits.push(BigInt(digit));
		}

		// Convert using core function
		const result = this.convertArray(bigIntDigits, fromBase, 256);

		// Convert BigInt array to Uint8Array
		return new Uint8Array(result.map(digit => Number(digit)));
	};

	/**
	 * Substitute characters in a string from one alphabet to another
	 * @param input  The input string
	 * @param fromAlphabet  The alphabet of the input
	 * @param toAlphabet  The alphabet to convert to
	 */
	static substitute = (input: string, fromAlphabet: string, toAlphabet: string) => {
		let result = [];
		for (let i = 0; i < input.length; i++) {
			const index = fromAlphabet.indexOf(input[i]);
			if (index === -1) {
				result.push(input[i]); // ignore unknown characters
			} else {
				result.push(toAlphabet[index]);
			}
		}
		return result.join('');
	};

	/**
	 * Rotate characters 13 places in the alphabet (ROT13 substitution cipher)
	 * @param input
	 */
	static rot13 = (input: string) => {
		return PolyConvert.substitute(
			input,
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
			'ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba'
		);
	};

	/**
	 * Static method to convert a number from one base to another with the default alphabet
	 * @param input  The string number
	 * @param fromBase  The base of the input number
	 * @param toBase  The base to convert to
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static base = (input: string | number | BigInt, fromBase: number, toBase: number) => {
		return new PolyConvert().applyBase(input, fromBase, toBase);
	};

	/**
	 * Static method to substitute the given alphabet then convert a number to the given base
	 * @param fromAlphabet
	 * @param input
	 * @param toBase
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static _from = (fromAlphabet: string, input: string, toBase: number) => {
		const substituted = PolyConvert.substitute(input, fromAlphabet, alphabets.standard);
		return PolyConvert.base(substituted, fromAlphabet.length, toBase);
	};

	/**
	 * Static method to convert a number from one base to another then convert to the given alphabet
	 * @param toAlphabet
	 * @param input
	 * @param fromBase
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static _to = (toAlphabet: string, input: string | number | BigInt, fromBase: number) => {
		const converted = PolyConvert.base(input, fromBase, toAlphabet.length);
		return PolyConvert.substitute(converted, alphabets.standard, toAlphabet);
	};

	/**
	 * Convert a number from the fax alphabet to another base (in the standard alphabet)
	 * @param input  The input string, in fax alphabet
	 * @param toBase  The base to convert to
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static fromFax = (input: string, toBase: number) => {
		return PolyConvert._from(alphabets.fax, input, toBase);
	};

	/**
	 * Convert a string number in the given base into the fax alphabet
	 * @param input  The input string number
	 * @param fromBase  The base of the input number
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static toFax = (input: string | number | BigInt, fromBase: number) => {
		return PolyConvert._to(alphabets.fax, input, fromBase);
	};

	/**
	 * Convert a number from the slug alphabet to another base (in the standard alphabet)
	 * @param input  The input string, in slug alphabet
	 * @param toBase  The base to convert to
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static fromSlug = (input: string, toBase: number) => {
		return PolyConvert._from(alphabets.slug, input, toBase);
	};

	/**
	 * Convert a string number in the given base into the slug alphabet
	 * @param input  The input string number
	 * @param fromBase  The base of the input number
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static toSlug = (input: string | number | BigInt, fromBase: number) => {
		return PolyConvert._to(alphabets.slug, input, fromBase);
	};

	/**
	 * Convert a number from the canonical base64 alphabet to another base (in the standard alphabet)
	 * @param input  The input string, in canonical base64 alphabet
	 * @param toBase  The base to convert to
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static from64 = (input: string, toBase: number) => {
		return PolyConvert._from(alphabets.base64, input, toBase);
	};

	/**
	 * Convert a string number in the given base into the canonical base64 alphabet
	 * @param input  The input string number
	 * @param fromBase  The base of the input number
	 * @throws Error  If a base is invalid or the input contains invalid digits
	 */
	static to64 = (input: string | number | BigInt, fromBase: number) => {
		return PolyConvert._to(alphabets.base64, input, fromBase);
	};
}
