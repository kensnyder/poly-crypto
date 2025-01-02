<?php

require_once(__DIR__ . '/../src/PolyConvert.php');

use PolyCrypto\PolyConvert;

describe('PolyConvert exceptions', function() {
    it('should fail on base 1', function() {
        expect(function() {
            PolyConvert::base('1011', 1, 10);
        })->toThrow(new \InvalidArgumentException('Base must be between 2 and 95'));
    });

    it('should fail on invalid base', function() {
        expect(function() {
            PolyConvert::base('1011', 'a', 10);
        })->toThrow();
    });

    it('should fail on empty', function() {
        expect(function() {
            PolyConvert::base('', 2, 10);
        })->toThrow(new \InvalidArgumentException('Input number cannot be empty'));
    });

    it('should fail on invalid digit', function() {
        expect(function() {
            PolyConvert::base('12', 2, 10);
        })->toThrow(new \InvalidArgumentException('Invalid digit "2" for fromBase 2'));
    });
});

describe('PolyConvert base conversion', function() {
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
        ['args' => ['ZZ', 62, 94], 'result' => 'Nh'],
        ['args' => ['JavaScript_Rocks!', 92, 10], 'result' => '510933176934557210798603247955210'],
        ['args' => ['And_TypeScript_too!', 92, 62], 'result' => '3KlBTupBB5PRF9AchQBHm'],
        ['args' => ['18446744073709551615', 10, 16], 'result' => 'FFFFFFFFFFFFFFFF'],
        ['args' => ['18446744073709551615', 10, 62], 'result' => 'LygHa16AHYF'],
        ['args' => ['kendsnyder', 62, 36], 'result' => '4SR4ME79DEEP'],
        ['args' => ['123456789012345678901234567890', 10, 92], 'result' => 'dz_(#U&v+a#uXnc'],
    ];

    foreach ($specs as $spec) {
        it("should handle converting \"{$spec['args'][0]}\" from base {$spec['args'][1]} to base {$spec['args'][2]}", function() use ($spec) {
            $result = PolyConvert::base($spec['args'][0], $spec['args'][1], $spec['args'][2]);
            expect($result)->toBe($spec['result']);
        });
    }
});

describe('PolyConvert presets', function() {
    it('should support PolyConvert::fromFax', function() {
        $result = PolyConvert::fromFax('467bcdfhjkmnpqrtvwxy', 10);
        expect($result)->toBe('14606467545964956303452810');
    });

    it('should support PolyConvert::toFax', function() {
        $result = PolyConvert::toFax('14606467545964956303452810', 10);
        expect($result)->toBe('467bcdfhjkmnpqrtvwxy');
    });

    it('should support PolyConvert::from64', function() {
        $result = PolyConvert::from64('BCDEFGHIJKLMNOP', 10);
        expect($result)->toBe('19961744145695222371767183');
    });

    it('should support PolyConvert::to64', function() {
        $result = PolyConvert::to64('19961744145695222371767183', 10);
        expect($result)->toBe('BCDEFGHIJKLMNOP');
    });

    it('should support PolyConvert::fromSlug', function() {
        $result = PolyConvert::fromSlug(
            '123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ',
            10
        );
        expect($result)->toBe(
            '65619590647494106872079167509227825748311557976153772654499440883483291755167717380843'
        );
    });

    it('should support PolyConvert::toSlug', function() {
        $result = PolyConvert::toSlug(
            '65619590647494106872079167509227825748311557976153772654499440883483291755167717380843',
            10
        );
        expect($result)->toBe('123456789bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ');
    });

    it('should support PolyConvert::toSlug/fromSlug on base 16', function() {
        $result = PolyConvert::toSlug('908af273ca23bd1fdd5e166be5a234b83d6bb332', 16);
        expect($result)->toBe('KppGKv5wKYb46vJkFWQcGFMkV5CF');
        $back = PolyConvert::fromSlug($result, 16);
        expect($back)->toBe('908AF273CA23BD1FDD5E166BE5A234B83D6BB332');
    });
});

describe('PolyConvert trivial cases', function() {
    it('should handle 0', function() {
        $converter = new PolyConvert();
        $result = $converter->applyBase('0', 10, 10);
        expect($result)->toBe('0');
    });

    it('should throw on invalid character', function() {
        expect(function() {
            $converter = new PolyConvert();
            $result = $converter->applyBase('a', 10, 2);
            print_r($result);
        })->toThrow();
    });
});

describe('PolyConvert::substitute()', function() {
    it('should handle rot13 transformation', function() {
        $input = 'hello';
        $from = 'abcdefghijklmnopqrstuvwxyz';
        $to = 'zyxwvutsrqponmlkjihgfedcba';
        $result = PolyConvert::substitute($input, $from, $to);
        expect($result)->toBe('svool');
    });

    it('should handle have dedicated rot13() function', function() {
        $input = 'Hello';
        $result = PolyConvert::rot13($input);
        expect($result)->toBe('Svool');
    });

    it('should ignore unknown characters', function() {
        $input = 'hello!';
        $from = 'abcdefghijklmnopqrstuvwxyz';
        $to = 'zyxwvutsrqponmlkjihgfedcba';
        $result = PolyConvert::substitute($input, $from, $to);
        expect($result)->toBe('svool!');
    });

    it('should support multi-byte characters', function() {
        $input = '1🫠🤩'; // Using UTF-8 characters for demonstration
        $from = '0123456789🫠🤩';
        $to = '0123456789AB';
        $result = PolyConvert::substitute($input, $from, $to);
        expect($result)->toBe('1AB');
    });

    it('should support multi-byte output', function() {
        $input = '1AB';
        $from = '0123456789AB';
        $to = '0123456789🫠🤩';
        $result = PolyConvert::substitute($input, $from, $to);
        expect($result)->toBe('1🫠🤩');
    });
});
