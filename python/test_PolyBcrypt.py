# coding=utf-8

import PolyBcrypt

fromPhp = '$2y$10$npEa/T9.5/aR36tMgICKYufSsReq9P9ioxV0cIpbB20KynjoYOz4.'
fromJs = '$2a$10$f5449ok7vQOhhHwKwjZqx.cKeuroAr68DDwhxd78JUPJVqoVFqseS'
fromPython = '$2a$12$GZJDKqVrXLi0JWdhWZ55EuCb7tKoMINe3Z/RrFFIbQpG3sW8sR7qu'

def test_should_ensure_password_is_at_most_72_chars():
    longPassword = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ok?'
    try:
        hash = PolyBcrypt.hash(longPassword)
        assert False
    except Exception:
        assert True

def test_should_ensure_cost_is_at_least_4():
    try:
        hash = PolyBcrypt.hash('abc', 3)
        assert False
    except Exception:
        assert True

def test_should_ensure_cost_is_at_most_31():
    try:
        hash = PolyBcrypt.hash('abc', 32)
        assert False
    except Exception:
        assert True

def test_should_produce_60_char_string():
    hash = PolyBcrypt.hash('abc')
    assert len(hash) is 60

def test_should_handle_unicode():
    hash = PolyBcrypt.hash('Ich weiß nicht 🔥. Bitte schön.')
    assert len(hash) is 60

def test_should_verify_a_php_hash():
    doesMatch = PolyBcrypt.verify('abc', fromPhp)
    assert doesMatch is True

def test_should_verify_a_js_hash():
    doesMatch = PolyBcrypt.verify('abc', fromJs)
    assert doesMatch is True

def test_should_parse_hashes_from_js():
    actual = PolyBcrypt.info(fromJs)
    assert actual['valid'] is True
    assert actual['version'] == '$2a$'
    assert actual['cost'] is 10
    assert actual['salt'] == 'f5449ok7vQOhhHwKwjZqx.'
    assert actual['hash'] == 'cKeuroAr68DDwhxd78JUPJVqoVFqseS'

#
# it('should parse hashes from python', () => {
# 	const actual = PolyBcrypt.info(fromPython);
# 	const expected = {
# 		valid: true,
# 		version: '$2a$',
# 		cost: 12,
# 		salt: 'GZJDKqVrXLi0JWdhWZ55Eu',
# 		hash: 'Cb7tKoMINe3Z/RrFFIbQpG3sW8sR7qu',
# 	};
# 	expect(actual).to.deep.equal(expected);
# });
#
# it('should parse hashes from php', () => {
# 	const actual = PolyBcrypt.info(fromPhp);
# 	const expected = {
# 		valid: true,
# 		version: '$2y$',
# 		cost: 10,
# 		salt: 'npEa/T9.5/aR36tMgICKYu',
# 		hash: 'fSsReq9P9ioxV0cIpbB20KynjoYOz4.',
# 	};
# 	expect(actual).to.deep.equal(expected);
# });
