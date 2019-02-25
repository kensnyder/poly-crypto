from distutils.core import setup

setup(
    name = 'poly-crypto',
    version = '1.0.0',
    description = "High-level cryptographic functions that are interoperable between NodeJS, PHP 7.1+, and Python.",
    author = 'kensnyder',
    author_email = 'kendsnyder@gmail.com',
    url = 'https://github.com/kensnyder/poly-crypto',
    py_modules=[],
    install_requires=[
        'pycryptodome==3.7.3',
        'py-bcrypt==0.4'
    ],
    namespace_packages=['PolyCrypto'],
    entry_points='''
        [PolyCrypto.PolyAES]
        [PolyCrypto.PolyBcrypt]
        [PolyCrypto.PolyDigest]
        [PolyCrypto.PolyRand]
    ''',
)
