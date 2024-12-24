<?php

namespace PolyCrypto;

require_once(__DIR__ . '/PolyRand.php');

use PolyCrypto\PolyRand;

class PolyConvert {
    const BASE_ERROR = 'Base must be between 2 and %s';
    const EMPTY_ERROR = 'Input number cannot be empty';
    const INVALID_DIGIT_ERROR = 'Invalid digit "%s" for base %s';

    /**
     * @var array
     */
    private $alphabet;

    /**
     * @param array $alphabet
     */
    public function __construct(array $alphabet) {
        $this->alphabet = $alphabet;
    }

    /**
     * @param array $alphabet
     * @return self
     */
    public static function withAlphabet(array $alphabet) {
        return new self($alphabet);
    }

    /**
     * @param string $input
     * @param int $max
     * @return array
     */
    private function ensureCasing($input, $max) {
        $str = implode('', array_slice($this->alphabet, 0, $max));
        if (preg_match('/[a-z]/', $str) && preg_match('/[A-Z]/', $str)) {
            return array($input, $this->alphabet);
        }
        return array(strtoupper($input), str_split(strtoupper($str)));
    }

    /**
     * @param string|int|float $input
     * @param int|string $fromBase
     * @param int|string $toBase
     * @return string
     * @throws Exception
     */
    public function applyBase($input, $fromBase, $toBase) {
        $input = (string)$input;
        $fromBase = (int)$fromBase;
        $toBase = (int)$toBase;

        if ($fromBase === $toBase) {
            return $input;
        }

        list($number, $alphabet) = $this->ensureCasing($input, max($toBase, $fromBase));

        // Input validation
        if (
            $fromBase < 2 ||
            $fromBase > count($alphabet) ||
            $toBase < 2 ||
            $toBase > count($alphabet) ||
            !is_numeric($fromBase) ||
            !is_numeric($toBase)
        ) {
            throw new \Exception(sprintf(self::BASE_ERROR, count($this->alphabet)));
        }

        if (!$number) {
            throw new \Exception(self::EMPTY_ERROR);
        }

        // First convert to decimal (base 10)
        $decimal = gmp_init(0);
        $digits = array_reverse(str_split($number));
        $fromBaseBig = gmp_init($fromBase);

        for ($i = 0; $i < count($digits); $i++) {
            $digit = array_search($digits[$i], $alphabet, true);
            if ($digit === false || $digit >= $fromBase) {
                throw new \Exception(sprintf(
                    self::INVALID_DIGIT_ERROR,
                    $digits[$i],
                    $fromBase
                ));
            }
            // Using GMP for power calculation
            $decimal = gmp_add(
                $decimal,
                gmp_mul(
                    gmp_init($digit),
                    gmp_pow($fromBaseBig, $i)
                )
            );
        }

        // Convert decimal to target base
        $result = '';
        $toBaseBig = gmp_init($toBase);

        while (gmp_cmp($decimal, 0) > 0) {
            $remainder = gmp_intval(gmp_mod($decimal, $toBaseBig));
            $result = $alphabet[$remainder] . $result;
            $decimal = gmp_div_q($decimal, $toBaseBig);
        }

        return $result;
    }

    /**
     * @return self
     */
    public static function slug() {
        return self::withAlphabet(PolyRand::SLUG_SYMBOL_LIST);
    }

    /**
     * @return self
     */
    public static function fax() {
        return self::withAlphabet(PolyRand::FAX_SYMBOL_LIST);
    }

    /**
     * @return self
     */
    public static function ascii() {
        return self::withAlphabet(str_split(
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_+={}|[]\\:";\'<>?,/-. '
        ));
    }

    /**
     * @param string|int|float $input
     * @param int|string $fromBase
     * @param int|string $toBase
     * @return string
     * @throws Exception
     */
    public static function base($input, $fromBase, $toBase) {
        $instance = self::ascii();
        return $instance->applyBase($input, $fromBase, $toBase);
    }
}
