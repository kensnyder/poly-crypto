# coding=utf-8

import PolyBcrypt

password = 'abc'
fromPhp = '$2y$10$npEa/T9.5/aR36tMgICKYufSsReq9P9ioxV0cIpbB20KynjoYOz4.'
fromPython = '$2a$12$GZJDKqVrXLi0JWdhWZ55EuCb7tKoMINe3Z/RrFFIbQpG3sW8sR7qu'
fromJs = '$2a$10$f5449ok7vQOhhHwKwjZqx.cKeuroAr68DDwhxd78JUPJVqoVFqseS'

def test_should_ensure_password_is_at_most_72_chars():
    longPassword = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ok?'
    try:
        hash = PolyBcrypt.hash(longPassword)
        assert False
    except Exception:
        assert True

def test_should_ensure_cost_is_at_least_4():
    try:
        hash = PolyBcrypt.hash(password, 3)
        assert False
    except Exception:
        assert True

def test_should_ensure_cost_is_at_most_31():
    try:
        hash = PolyBcrypt.hash(password, 32)
        assert False
    except Exception:
        assert True

def test_should_produce_60_char_string():
    hash = PolyBcrypt.hash(password)
    assert len(hash) is 60

def test_should_produce_different_hashes_every_time():
    hash1 = PolyBcrypt.hash(password, 10)
    hash2 = PolyBcrypt.hash(password, 10)
    assert hash1 != hash2

def test_should_handle_unicode():
    hash = PolyBcrypt.hash('Ich weiß nicht 🔥. Bitte schön.')
    assert len(hash) is 60

def test_should_verify_its_own_hashes():
    hash = PolyBcrypt.hash(password)
    doesMatch = PolyBcrypt.verify(password, hash)
    assert doesMatch is True

def test_should_verify_passwords_from_js():
    doesMatch = PolyBcrypt.verify(password, fromJs)
    assert doesMatch is True

def test_should_verify_passwords_from_python():
    doesMatch = PolyBcrypt.verify(password, fromPython)
    assert doesMatch is True

def test_should_verify_passwords_from_php():
    doesMatch = PolyBcrypt.verify(password, fromPhp)
    assert doesMatch is True

def test_should_parse_hashes_from_js():
    actual = PolyBcrypt.info(fromJs)
    assert actual['valid'] is True
    assert actual['version'] == '$2a$'
    assert actual['cost'] is 10
    assert actual['salt'] == 'f5449ok7vQOhhHwKwjZqx.'
    assert actual['hash'] == 'cKeuroAr68DDwhxd78JUPJVqoVFqseS'

def test_should_parse_hashes_from_python():
    actual = PolyBcrypt.info(fromPython)
    assert actual['valid'] is True
    assert actual['version'] == '$2a$'
    assert actual['cost'] is 12
    assert actual['salt'] == 'GZJDKqVrXLi0JWdhWZ55Eu'
    assert actual['hash'] == 'Cb7tKoMINe3Z/RrFFIbQpG3sW8sR7qu'

def test_should_parse_hashes_from_php():
    actual = PolyBcrypt.info(fromPhp)
    assert actual['valid'] is True
    assert actual['version'] == '$2y$'
    assert actual['cost'] is 10
    assert actual['salt'] == 'npEa/T9.5/aR36tMgICKYu'
    assert actual['hash'] == 'fSsReq9P9ioxV0cIpbB20KynjoYOz4.'
