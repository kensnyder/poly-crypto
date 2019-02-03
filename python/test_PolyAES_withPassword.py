# coding=utf-8

import PolyAES

password = 'The quick brown fox jumped over the lazy dog'
salt = 'Four score and seven years ago'
sheSellsDecrypted = 'She sells sea shells by the sea shore'
sheSellsEncrypted = 'R7k/YWDFEGiZ1q0m0Azlf1CUjunSrHBvCrrdRfG/YGi79tM1BagDn1rBsurZcEAhFNvvV7yVZgJ/RR2D7X/P9xOQt+XI'

def test_should_raise_error_if_key_is_not_64_char_hex():
    try:
        PolyAES.withKey(password, 'hello w')
        assert False
    except Exception:
        assert True

def test_should_encrypt_ok():
    crypto = PolyAES.withPassword(password, salt)
    data = 'I love encryption'
    encrypted = crypto.encrypt(data)
    decrypted = crypto.decrypt(encrypted)
    assert data == decrypted

def test_should_handle_unicode():
    crypto = PolyAES.withPassword(password, salt)
    data = 'I ❤️ encryption'
    encrypted = crypto.encrypt(data)
    decrypted = crypto.decrypt(encrypted)
    assert data == decrypted

def test_should_encrypt_differently_every_time():
    crypto = PolyAES.withPassword(password, salt)
    data = 'Pack my box with five dozen liquor jugs.'
    encrypted1 = crypto.encrypt(data)
    encrypted2 = crypto.encrypt(data)
    assert encrypted1 != encrypted2

def test_should_interoperate_with_node_and_php():
    data = PolyAES.withPassword(password, salt).decrypt(sheSellsEncrypted)
    assert data == sheSellsDecrypted
