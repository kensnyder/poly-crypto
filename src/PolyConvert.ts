import PolyRand from './PolyRand';

export default class PolyConvert {
	static BASE_ERROR = 'Base must be between 2 and %s';
	static EMPTY_ERROR = 'Input number cannot be empty';
	static INVALID_DIGIT_ERROR = 'Invalid digit "%s" for base %s';

	alphabet: string[];

	constructor(alphabet: string[]) {
		this.alphabet = alphabet;
	}

	static withAlphabet(alphabet: string[]): PolyConvert {
		return new PolyConvert(alphabet);
	}

	ensureCasing(input: string, max: number): [string, string[]] {
		const str = this.alphabet.slice(0, max).join('');
		if (/[a-z]/.test(str) && /[A-Z]/.test(str)) {
			return [input, this.alphabet];
		}
		return [input.toUpperCase(), str.toUpperCase().split('')];
	}

	applyBase = (input: string | number | BigInt, fromBase: number, toBase: number) => {
		input = String(input);
		fromBase = Number(fromBase);
		toBase = Number(toBase);

		if (fromBase === toBase) {
			return input;
		}

		const [number, alphabet] = this.ensureCasing(input, Math.max(toBase, fromBase));

		// Input validation
		if (
			fromBase < 2 ||
			fromBase > alphabet.length ||
			toBase < 2 ||
			toBase > alphabet.length ||
			isNaN(fromBase) ||
			isNaN(toBase)
		) {
			throw new Error(PolyConvert.BASE_ERROR.replace('%s', String(this.alphabet.length)));
		}

		if (!number) {
			throw new Error(PolyConvert.EMPTY_ERROR);
		}

		// First convert to decimal (base 10)
		let decimal = 0n;
		const digits = number.split('').reverse();
		const fromBaseBig = BigInt(fromBase);

		for (let i = 0; i < digits.length; i++) {
			const digit = alphabet.indexOf(digits[i]);
			if (digit === -1 || digit >= fromBase) {
				throw new Error(
					PolyConvert.INVALID_DIGIT_ERROR.replace('%s', digits[i]).replace(
						'%s',
						String(fromBase)
					)
				);
			}
			// Using BigInt for power calculation
			decimal += BigInt(digit) * fromBaseBig ** BigInt(i);
		}

		// Convert decimal to target base
		let result = '';
		const toBaseBig = BigInt(toBase);

		while (decimal > 0n) {
			const remainder = Number(decimal % toBaseBig); // Safe conversion as remainder is always < toBase
			result = alphabet[remainder] + result;
			decimal = decimal / toBaseBig;
		}

		return result;
	};

	static slug = PolyConvert.withAlphabet(PolyRand.SLUG_SYMBOL_LIST);
	static fax = PolyConvert.withAlphabet(PolyRand.FAX_SYMBOL_LIST);
	static ascii = PolyConvert.withAlphabet(
		'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_+={}|[]\\:";\'<>?,/-. '.split(
			''
		)
	);
	static base: (typeof PolyConvert)['ascii']['applyBase'];
}

PolyConvert.base = PolyConvert.ascii.applyBase;
