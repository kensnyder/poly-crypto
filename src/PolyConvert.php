<?php

namespace PolyCrypto;

/**
 * Default alphabets for substitution
 */
class Alphabets {
    public const STANDARD = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/`~!@#$%^&*()_={}|[]\\:";\'<>?,-. ';
    public const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    public const SLUG = '0123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
    public const FAX = '3467bcdfhjkmnpqrtvwxy';
}

/**
 * Class to convert numbers between bases using arbitrary alphabets
 */
class PolyConvert {
    /**
     * Error messages
     */
    public const BASE_ERROR = 'Base must be between 2 and %d';
    public const EMPTY_ERROR = 'Input number cannot be empty';
    public const INVALID_DIGIT_ERROR = 'Invalid digit "%s" for fromBase %d';

    /**
     * The alphabet to use for conversion
     */
    public $alphabet;

    /**
     * Create a new PolyConvert instance given an alphabet
     * @param string $alphabet
     */
    public function __construct(string $alphabet = null) {
        $this->alphabet = $alphabet ?? Alphabets::STANDARD;
    }

    /**
     * Ensure that the string number has both upper and lower case characters
     * @param string $digits The string base
     * @param int $maxBase The base that will be used for conversion
     * @return string
     */
    public function ensureCasing(string $digits, int $maxBase): string {
        $str = substr($this->alphabet, 0, $maxBase);
        if (preg_match('/[a-z]/', $str) && preg_match('/[A-Z]/', $str)) {
            return $digits;
        }
        return strtoupper($digits);
    }

    /**
     * Validate the fromBase and toBase values are within the alphabet range
     * @param int $fromBase Must be between 2 and the alphabet length
     * @param int $toBase Must be between 2 and the alphabet length
     * @throws InvalidArgumentException If fromBase or toBase are invalid
     */
    public function validateBase(int $fromBase, int $toBase): void {
        $maxBase = max($fromBase, $toBase, strlen($this->alphabet)) ?: strlen($this->alphabet);

        if ($fromBase < 2 || $fromBase > $maxBase || $toBase < 2 || $toBase > $maxBase) {
            throw new InvalidArgumentException(sprintf(static::BASE_ERROR, $maxBase));
        }
    }

    /**
     * Convert an array of strings from one base to another
     * @param array $digits The input array of digits
     * @param int $fromBase The input's base
     * @param int $toBase The output's base
     * @return array
     */
    public function convertArray(array $digits, int $fromBase, int $toBase): array {
        if (empty($digits)) {
            throw new InvalidArgumentException(static::EMPTY_ERROR);
        }

        $result = ['0'];

        if (count($digits) === 1 && $digits[0] === '0') {
            return $result;
        }

        // Process each digit
        foreach ($digits as $digit) {
            // Multiply current result by source base and add new digit
            $carry = $digit;
            for ($i = 0; $i < count($result); $i++) {
                $product = bcadd(bcmul($result[$i], (string)$fromBase), (string)$carry);
                $result[$i] = bcmod($product, (string)$toBase);
                $carry = bcdiv($product, (string)$toBase, 0);
            }

            // Add any remaining carry digits
            while (bccomp($carry, '0') > 0) {
                $result[] = bcmod($carry, (string)$toBase);
                $carry = bcdiv($carry, (string)$toBase, 0);
            }
        }

        return array_reverse($result);
    }

    /**
     * Convert a number from one base to another
     * @param string|int $input The number to convert
     * @param int $fromBase The input's base
     * @param int $toBase The output's base
     * @return string
     * @throws InvalidArgumentException If a base is invalid or the input contains invalid digits
     */
    public function applyBase($input, int $fromBase, int $toBase): string {
        $input = (string)$input;

        $this->validateBase($fromBase, $toBase);

        if ($fromBase >= 2 && $fromBase === $toBase) {
            return $input;
        }

        // Normalize small alphabets to uppercase
        $digits = $this->ensureCasing($input, $fromBase);

        // Convert input string to array of digit values
        $numericDigits = [];
        for ($i = 0; $i < strlen($digits); $i++) {
            $digit = strpos($this->alphabet, $digits[$i]);
            if ($digit === false || $digit >= $fromBase) {
                throw new InvalidArgumentException(
                    sprintf(static::INVALID_DIGIT_ERROR, $digits[$i], $fromBase)
                );
            }
            $numericDigits[] = (string)$digit;
        }

        // Convert using core function
        $result = $this->convertArray($numericDigits, $fromBase, $toBase);

        // Convert result back to string using alphabet
        $mapped = array_map(function($digit) {
            return $this->alphabet[(int)$digit];
        }, $result);

        // Normalize small alphabets to uppercase
        return $this->ensureCasing(implode('', $mapped), $toBase);
    }

    /**
     * Static method to substitute characters in a string from one alphabet to another
     * @param string $input The input string
     * @param string $fromAlphabet The alphabet of the input
     * @param string $toAlphabet The alphabet to convert to
     * @return string
     */
    public static function substitute(string $input, string $fromAlphabet, string $toAlphabet): string {
        $result = [];
        for ($i = 0; $i < strlen($input); $i++) {
            $index = strpos($fromAlphabet, $input[$i]);
            if ($index === false) {
                $result[] = $input[$i];
            } else {
                $result[] = $toAlphabet[$index];
            }
        }
        return implode('', $result);
    }

    /**
     * Rotate characters 13 places in the alphabet (ROT13 substitution cipher)
     * @param string $input
     * @return string
     */
    public static function rot13(string $input): string {
        return static::substitute(
            $input,
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            'ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba'
        );
    }

    /**
     * Static method to convert a number from one base to another with the default alphabet
     * @param string|int $input The string number
     * @param int $fromBase The base of the input number
     * @param int $toBase The base to convert to
     * @return string
     */
    public static function base($input, int $fromBase, int $toBase): string {
        $converter = new self();
        return $converter->applyBase($input, $fromBase, $toBase);
    }

    /**
     * Static helper method for alphabet conversion
     * @param string $fromAlphabet
     * @param string $input
     * @param int $toBase
     * @return string
     */
    protected static function _from(string $fromAlphabet, string $input, int $toBase): string {
        $substituted = static::substitute($input, $fromAlphabet, Alphabets::STANDARD);
        return static::base($substituted, strlen($fromAlphabet), $toBase);
    }

    /**
     * Static helper method for alphabet conversion
     * @param string $toAlphabet
     * @param string|int $input
     * @param int $fromBase
     * @return string
     */
    protected static function _to(string $toAlphabet, $input, int $fromBase): string {
        $converted = static::base($input, $fromBase, strlen($toAlphabet));
        return static::substitute($converted, Alphabets::STANDARD, $toAlphabet);
    }

    /**
     * Convert a number from the fax alphabet to another base
     * @param string $input The input string, in fax alphabet
     * @param int $toBase The base to convert to
     * @return string
     */
    public static function fromFax(string $input, int $toBase): string {
        return static::_from(Alphabets::FAX, $input, $toBase);
    }

    /**
     * Convert a string number in the given base into the fax alphabet
     * @param string|int $input The input string number
     * @param int $fromBase The base of the input number
     * @return string
     */
    public static function toFax($input, int $fromBase): string {
        return static::_to(Alphabets::FAX, $input, $fromBase);
    }

    /**
     * Convert a number from the slug alphabet to another base
     * @param string $input The input string, in slug alphabet
     * @param int $toBase The base to convert to
     * @return string
     */
    public static function fromSlug(string $input, int $toBase): string {
        return static::_from(Alphabets::SLUG, $input, $toBase);
    }

    /**
     * Convert a string number in the given base into the slug alphabet
     * @param string|int $input The input string number
     * @param int $fromBase The base of the input number
     * @return string
     */
    public static function toSlug($input, int $fromBase): string {
        return static::_to(Alphabets::SLUG, $input, $fromBase);
    }

    /**
     * Convert a number from the canonical base64 alphabet to another base
     * @param string $input The input string, in canonical base64 alphabet
     * @param int $toBase The base to convert to
     * @return string
     */
    public static function from64(string $input, int $toBase): string {
        return static::_from(Alphabets::BASE64, $input, $toBase);
    }

    /**
     * Convert a string number in the given base into the canonical base64 alphabet
     * @param string|int $input The input string number
     * @param int $fromBase The base of the input number
     * @return string
     */
    public static function to64($input, int $fromBase): string {
        return static::_to(Alphabets::BASE64, $input, $fromBase);
    }
}
