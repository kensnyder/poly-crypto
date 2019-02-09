# coding=utf-8

import PolyAES

password = 'The quick brown fox jumped over the lazy dog'
salt = 'Four score and seven years ago'
plaintext = 'abc'
jsCiphertext = 'eX8GRry2EX1v8dKJAEDl4114AaOLGaBlJyNW9JvLiQ8ZHGk='
pyCiphertext = 'AH70szpL2yBv6WK4Ig8BJvlyTRCe7N5EYwvY+0Zv427xCck='
phpCiphertext = '8Qcjp8nNJgiPZIFl5X+qI6E9M/Vej6IurL/y8gdCVMYRhh0='

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

def test_should_decrypt_js_ciphertext():
    data = PolyAES.withPassword(password, salt).decrypt(jsCiphertext)
    assert data == plaintext

def test_should_decrypt_php_ciphertext():
    data = PolyAES.withPassword(password, salt).decrypt(phpCiphertext)
    assert data == plaintext

def test_should_decrypt_python_ciphertext():
    data = PolyAES.withPassword(password, salt).decrypt(pyCiphertext)
    assert data == plaintext
