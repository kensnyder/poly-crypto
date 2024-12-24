<?php

require_once(__DIR__ . '/../src/PolyConvert.php');

use PolyCrypto\PolyConvert;

describe('PolyConvert', function() {
    describe('exceptions', function() {
        it('should fail on base 1', function() {
            $thrower = function() {
                PolyConvert::base('1011', 1, 10);
            };
            expect($thrower)->toThrow(
                new \Exception('Base must be between 2 and 95')
            );
        });

        it('should fail on invalid base', function() {
            $thrower = function() {
                PolyConvert::base('1011', 'a', 10);
            };
            expect($thrower)->toThrow(
                new \Exception('Base must be between 2 and 95')
            );
        });

        it('should fail on empty', function() {
            $thrower = function() {
                PolyConvert::base('', 2, 10);
            };
            expect($thrower)->toThrow(
                new \Exception('Input number cannot be empty')
            );
        });

        it('should fail on invalid digit', function() {
            $thrower = function() {
                PolyConvert::base('12', 2, 10);
            };
            expect($thrower)->toThrow(
                new \Exception('Invalid digit "2" for base 2')
            );
        });
    });

    describe('convert()', function() {
        $specs = [
            ['args' => [11, 10, 10], 'result' => '11'],
            ['args' => [11, 10, 2], 'result' => '1011'],
            ['args' => ['1011', 2, 10], 'result' => '11'],
            ['args' => ['ff', 16, 10], 'result' => '255'],
            ['args' => ['FF', 16, 10], 'result' => '255'],
            ['args' => ['ee', 15, 16], 'result' => 'E0'],
            ['args' => ['EE', 15, 16], 'result' => 'E0'],
            ['args' => ['Ee', 15, 16], 'result' => 'E0'],
            ['args' => ['zz', 36, 10], 'result' => '1295'],
            ['args' => ['ZZ', 36, 10], 'result' => '1295'],
            ['args' => ['ZZ', 62, 94], 'result' => 'E:'],
            ['args' => ['JavaScript_Rocks!', 92, 10], 'result' => '1188231054825008491419286819780752'],
            ['args' => ['And_TypeScript_too!', 92, 62], 'result' => 'btjYsDwwuWrElSt7WRf2g'],
            ['args' => ['18446744073709551615', 10, 16], 'result' => 'FFFFFFFFFFFFFFFF'],
            ['args' => ['18446744073709551615', 10, 62], 'result' => 'lYGhA16ahyf'],
            ['args' => ['kendsnyder', 42, 36], 'result' => '29h0lkc04u3'],
            // Note: PHP doesn't have BigInt, but GMP handles large numbers
            ['args' => ['123456789012345678901234567890', 10, 92], 'result' => 'DZ=_%u(V`A%UxNC'],
        ];

        foreach ($specs as $spec) {
            it("should handle converting \"{$spec['args'][0]}\" from base {$spec['args'][1]} to base {$spec['args'][2]}", function() use ($spec) {
                $result = PolyConvert::base($spec['args'][0], $spec['args'][1], $spec['args'][2]);
                expect($result)->toBe($spec['result']);
            });
        }
    });

    describe('withAlphabet()', function() {
        it('should handle custom alphabet', function() {
            $converter = PolyConvert::withAlphabet(str_split('custom'));
            $result = $converter->applyBase('tom', 6, 5);
            expect($result)->toBe('UCSS');
        });
        it('should support PolyConvert::slug()', function() {
            $result = PolyConvert::slug()->applyBase('0123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ', 52, 36);
            expect($result)->toBe('1rxxcgff2s44lsmpCcqtqF9p9vDDd67Bvgpqtlnw3ltFpq4r53m6grGh');
        });
        it('should support PolyConvert::fax()', function() {
            $result = PolyConvert::fax()->applyBase('3467bcdfhjkmnpqrtvwxy', 21, 10);
            expect($result)->toBe('4BD3DBDFCBCJDBJCD737BC6H43');
        });
    });
});
