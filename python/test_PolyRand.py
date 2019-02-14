# coding=utf-8

import re
import PolyRand

def test_bytes_should_return_requested_size():
    hash = PolyRand.bytes(32)
    assert len(hash) is 32

def test_hex_should_return_requested_size():
    hash = PolyRand.hex(32)
    assert len(hash) is 32

def test_hex_should_return_only_hex_digits():
    hash = PolyRand.hex(42)
    assert re.match(r'^[a-f0-9]{42}$', hash)

def test_slug_should_return_requested_size():
    hash = PolyRand.slug(32)
    assert len(hash) is 32

def test_slug_should_return_letters_numbers_but_no_vowels():
    hash = PolyRand.slug(2000)
    assert re.match(r'^[a-z0-9]{2000}$', hash, re.I)
    assert re.match(r'[aeiou]', hash, re.I) is None

def test_fax_should_return_requested_size():
    hash = PolyRand.fax(101)
    assert len(hash) is 101

def test_fax_should_return_the_proper_symbol_list():
    hash = PolyRand.fax(2000)
    assert re.match(r'^[3467bcdfhjkmnpqrtvwxy]{2000}$', hash)

def test_string_should_raise_error_if_symbol_list_is_too_short():
    try:
        PolyRand.string(42, ['a'])
        assert False
    except:
        assert True

def test_string_should_return_requested_size():
    hash = PolyRand.string(101, ['a','b','c'])
    assert len(hash) is 101

def test_string_should_return_the_proper_symbol_list():
    hash = PolyRand.string(200, ['a','b','c'])
    assert re.match(r'^[abc]{200}$', hash)

def test_string_should_handle_unicode_symbol_list():
    hash = PolyRand.string(1, ['💻', '🖥️'])
    assert (hash == '💻' or hash == '🖥️')
