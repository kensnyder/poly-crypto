# coding=utf-8

import PolyAES

keyUpper = 'C639A572E14D5075C526FDDD43E4ECF6B095EA17783D32EF3D2710AF9F359DD4'
keyLower = 'c639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359dd4'
keyMixed = 'C639a572e14d5075c526fddd43e4ecf6b095ea17783d32ef3d2710af9f359DD4'
key2     = 'E59DD4C639CF6B095EA17783D32EF3D2710ADD43E4F9F3A572E14D5075C526FD'
sheSellsDecrypted = 'She sells sea shells by the sea shore'
sheSellsEncrypted = 'czYXSezcLbzy5bc93r7bkhcvRlCSiY1GVyRgNjrrU+7eUxJfwE2Ct4v0VLt4TnEw8lcoXxiEt5sKX96k0syri9T9HXFb'

def test_should_raise_error_if_key_is_not_64_char_hex():
    try:
        PolyAES.withKey('xyz')
        assert False
    except Exception:
        assert True

def test_should_encrypt_ok():
    data = 'I love encryption'
    encrypted = PolyAES.withKey(keyUpper).encrypt(data)
    decrypted = PolyAES.withKey(keyUpper).decrypt(encrypted)
    assert data == decrypted

def test_should_handle_unicode():
    crypto = PolyAES.withKey(keyUpper)
    data = 'I ❤️ encryption'
    encrypted = crypto.encrypt(data)
    decrypted = crypto.decrypt(encrypted)
    assert decrypted == data

def test_should_encrypt_differently_every_time():
    crypto = PolyAES.withKey(key2)
    data = 'Pack my box with five dozen liquor jugs.'
    encrypted1 = crypto.encrypt(data)
    encrypted2 = crypto.encrypt(data)
    assert encrypted1 != encrypted2

def test_should_treat_hexidecimal_case_insensitively():
    data = 'She sells sea shells by the sea shore'
    encrypted = PolyAES.withKey(keyUpper).encrypt(data)
    decrypted = PolyAES.withKey(keyLower).decrypt(encrypted)
    assert decrypted == data

    encrypted2 = PolyAES.withKey(keyLower).encrypt(data)
    decrypted2 = PolyAES.withKey(keyMixed).decrypt(encrypted2)
    assert decrypted2 == data

    encrypted3 = PolyAES.withKey(keyMixed).encrypt(data)
    decrypted3 = PolyAES.withKey(keyUpper).decrypt(encrypted3)
    assert decrypted3 == data

def test_should_interoperate_with_node_and_php():
    data = PolyAES.withKey(keyUpper).decrypt(sheSellsEncrypted)
    assert data == sheSellsDecrypted
