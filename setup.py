from distutils.core import setup

setup(
    name = 'poly-aes',
    version = '1.0.0',
    description = "Encrypt and decrypt data with AES-256 GCM, compatible with PHP's openssl_encrypt() and NodeJS's node-forge",
    author = 'kensnyder',
    author_email = 'kendsnyder@gmail.com',
    url = 'https://github.com/kensnyder/poly-aes',
    py_modules=['poly-aes'],
    install_requires=[
        'PyCryptodome'
    ],
    entry_points='''
        
    ''',
)
