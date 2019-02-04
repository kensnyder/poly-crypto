# coding=utf-8

import PolyBcrypt

fromPhp = '$2y$10$npEa/T9.5/aR36tMgICKYufSsReq9P9ioxV0cIpbB20KynjoYOz4.'
fromJs = '$2a$10$vMnWq1w8ESB/m09JUf2dNOr/CtEqGua7a0jBYHpFVzYy6fVE4K9oK'

def test_should_produce_60_char_string():
    hash = PolyBcrypt.hash('abc')
    assert len(hash) is 60

def test_should_verify_a_php_hash():
    doesMatch = PolyBcrypt.verify('abc', fromPhp)
    assert doesMatch is True

def test_should_verify_a_js_hash():
    doesMatch = PolyBcrypt.verify('abc', fromJs)
    assert doesMatch is True
