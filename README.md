# poly-crypto

**Poly**glot **Crypto**graphy. High-level cryptographic functions that are interoperable between NodeJS, PHP 7.1+, and Python.

## Project Goals

1. Two-way symmetric encryption with a key or with password and salt
1. Password hashing
1. APIs that work exactly the same on NodeJS, PHP 7.1, and Python
1. Packages for Python and Node that can be used on serverless functions without external C bindings

## Installation

```bash
# PHP
composer install poly-crypto

# NodeJS
npm install --save poly-crypto

# Python
pip install poly-crypto
```

## Cheatsheet

| Section | NodeJS/Python | PHP |
| --- | --- | --- |
| [Encrypt with key](#encrypt-and-decrypt-with-key) | PolyAES.withKey(key).encrypt(data) | PolyAES::withKey($key)->encrypt($data) | 
| [Decrypt with key](#encrypt-and-decrypt-with-key) | PolyAES.withKey(key).decrypt(encrypted) | PolyAES::withKey($key)->decrypt($encrypted) | 
| [Encrypt with password](#encrypt-and-decrypt-with-password) | PolyAES.withPassword(password, salt).encrypt(data) | PolyAES::withPassword($password, $salt)->encrypt($data) |
| [Decrypt with password](#encrypt-and-decrypt-with-password) | PolyAES.withPassword(password, salt).decrypt(encrypted) | PolyAES::withPassword($password, $salt)->decrypt($encrypted) |
| [Bcrypt hash](#password-hashing) | PolyBcrypt.hash(password) | PolyBcrypt::hash($password) |
| [Bcrypt verify](#password-hashing) | PolyBcrypt.verify(password, hash) | PolyBcrypt::verify($password, $hash) |
| [Digest functions](#digest-functions) | PolyHash.sha256(data) | PolyHash::sha256($data) |
| [Random functions](#random-functions) | PolyRand.slug(length) | PolyRand::slug($length) |

## Table of Contents

1. [Technology choices](#technology-choices)
	1. [AES-255 GCM](#aes-256-gcm)
	1. [Bcrypt](#bcrypt)
1. [Use Cases](#use-cases)	
1. [AES encryption](#aes-encryption)
	1. [Encrypt and decrypt with key](#encrypt-and-decrypt-with-key)
	1. [Encrypt and decrypt with password](#encrypt-and-decrypt-with-password)
1. [Password hashing](#password-hashing) 
1. [Digest functions](#digest-functions)
1. [Random functions](#random-functions)
1. [Performance](#performance)
1. [Command line utilities](#command-line-utilities)	
1. [Browser usage](#browser-usage)
1. [JavaScript direct import](#javascript-direct-import)
1. [Unit tests](#unit-tests)
1. [Open Source ISC Licence](#licence)

## Technology choices

### AES-256 GCM

As of February 2019, the most secure symmetric encryption that is available across PHP, NodeJS and Python is
AES-256 Encryption with GCM block mode. With the right arguments and options, these 3 libraries can decrypt 
one another's encrypted strings: Python's PyCryptodome, PHP 7.1's openssl_* functions and npm's node-forge.

### Bcrypt

As of February 2019, the industry standard for hashing passwords is bcrypt. These 3 libraries can hash and
verify one another's hashes: Python's bcrypt, PHP's password_hash function, npm's bcrypt-js

### urandom

Cryptographic randomness is tricky. These 3 sources can provide good randomness: Python's os.urandom()
function, PHP's openssl_random_pseudo_bytes() function and Node's crypto.randomBytes() function.

## Use cases

poly-crypto's basic use cases:

|     | Case | Input | Output | NodeJS/Python |
| --- | ---- | ----- | ------ | ------------- |
| 1.  | Encrypt data that you can to decrypt later | Encryption key string | base-64 encoded string | PolyAES.withKey(hexKey).encrypt(data) |
| 2.  | Encrypt data for a user that he or she can decrypt later | User-supplied password & system salt | base-64 encoded string | PolyAES.withPassword(password, salt).encrypt(data) |
| 3.  | Hash passwords with bcrypt | Password string | bcrypt hash | PolyBcrypt.hash(password) |
| 4.  | Check if a password matches the given bcrypt hash | Password string & bcrypt hash | True if password matches | PolyBcrypt.verify(password, hash) |
| 5.  | Generate digests (e.g. sha256) | String data | digest string | PolyHash.sha256(data) |
| 6.  | Generate random slugs | number of characters | a string with random characters | PolyRand.slug(numCharacters) |

## Misuse

1. **File encryption.** poly-crypto modules are not meant to be used to encrypt 
entire files. You'll want to use a C-based library that is designed to encrypt
large amounts of data quickly. File encryption considerations:
	1. poly-crypto is not fast for large files.
	1. AES-256 GCM encryption can be parallelized in languages that support
	   threading for faster processing
1. **Streaming data.** PolyAES is not designed to encrypt streaming data.	
1. **Secure key storage.** If you store encryption keys or user passwords in 
plain text, encryption will not provide protection.
1. **Digests for passwords.** Do not use md5 or any sha* digest for hashing
passwords, even if you use salt. PolyBcrypt is the only poly-crypto module 
designed for hashing passwords.

### AES Encryption

#### Encrypt and decrypt with key

Note: key should be a 64-character hex-encoded string stored in a secure param store.
To generate a cryptographically secure random key, use `PolyAES.generateKey(64)`.

NodeJS:
```js
const { PolyAES } = require('poly-crypto');

const hexKey = '64-char hex encoded string from secure param store';
const encrypted = PolyAES.withKey(hexKey).encrypt(data); 
const decrypted = PolyAES.withKey(hexKey).decrypt(encrypted); 
```

Python:
```python
import PolyAES

hexKey = '64-char hex encoded string from secure param store'
encrypted = PolyAES.withKey(hexKey).encrypt(data)
decrypted = PolyAES.withKey(hexKey).decrypt(encrypted)
```

PHP:
```php
<?php

require_once('vendor/autoload.php');
use PolyCrypto\PolyAES;

$hexKey = '64-char hex encoded string from secure param store';
$encrypted = PolyAES::withKey($hexKey)->encrypt($data);
$decrypted = PolyAES::withKey($hexKey)->decrypt($encrypted);
```

#### Encrypt and decrypt with password

NodeJS:
```js
const { PolyAES } = require('poly-crypto');

const password = 'String from user';
const salt = 'String from secure param store';
const encrypted = PolyAES.withPassword(password, salt).encrypt(data); 
const decrypted = PolyAES.withPassword(password, salt).decrypt(encrypted); 
```

Python:
```python
import PolyAES

password = 'String from user'
salt = 'String from secure param store'
encrypted = PolyAES.withPassword(password, salt).encrypt(data)
decrypted = PolyAES.withPassword(password, salt).decrypt(encrypted)
```

PHP:
```php
<?php

require_once('vendor/autoload.php');
use PolyCrypto\PolyAES;

$password = 'String from user';
$salt = 'String from secure param store';
$encrypted = PolyAES::withPassword($password, $salt)->encrypt($data); 
$decrypted = PolyAES::withPassword($password, $salt)->decrypt($encrypted); 
```

### Password hashing

Bcrypt hashes are designed to store user passwords with a max length of 72 bytes.
If a longer string is passed, an exception will be thrown. Keep in mind that
Unicode characters require multiple bytes.

Bcrypt conveniently stores salt along with the password. That ensures that
identical passwords will get different hashes. As such, you cannot compare
two hashes, you must use the `PolyBcrypt.verify()` function to see if the
given password matches the hash you have on record.

NodeJS:
```js
const { PolyBcrypt } = require('poly-crypto');

const password = 'Password from a user';
const hash = PolyBcrypt.hash(password); 
const isCorrect = PolyBcrypt.verify(password, hash);
```

Python:
```python
import PolyBcrypt

password = 'Password from a user'
hash = PolyBcrypt.hash(password)
is_correct = PolyBcrypt.verify(password, hash)
```

PHP:
```php
<?php

require_once('vendor/autoload.php');
use PolyCrypto\PolyBcrypt;

$password = 'Password from a user';
$hash = PolyBcrypt::hash($password); 
$isCorrect = PolyBcrypt::verify($password, $hash);
```

### Digest functions 

Standard one-way digest functions.

NodeJS:
```js
const { PolyHash } = require('poly-crypto');

PolyHash.sha512(data);
PolyHash.sha256(data);
PolyHash.sha1(data);
PolyHash.md5(data);
```

Python:
```python
import PolyHash

PolyHash.sha512(data)
PolyHash.sha256(data)
PolyHash.sha1(data)
PolyHash.md5(data)
```

PHP:
```php
<?php

require_once('vendor/autoload.php');
use PolyCrypto\PolyHash;

PolyHash::sha512($data);
PolyHash::sha256($data);
PolyHash::sha1($data);
PolyHash::md5($data);
```

### Random functions

Simple functions to generate random values synchronously.

NodeJS:
```js
const { PolyRand } = require('poly-crypto');

// generate a string containing numbers and letters minus vowels
// suitable for resources such as URLs with random strings 
PolyRand.slug(length);

// generate a string containing hexadecimal characters
PolyRand.hex(length);

// generate a string containing numbers and lowercase letters
// that are unambiguous when written down
PolyRand.fax(length);

// generate a string containing lowercase letters minus vowels
const symbolList = 'bcdfghjklmnpqrstvwxyz'.split('');
PolyRand.string(symbolList, length);

// generate random bytes in binary form
PolyRand.bytes(length);
```

Python:
```python
import PolyHash

# generate a string containing numbers and letters minus vowels
# suitable for resources such as URLs with random strings 
PolyRand.slug(length)

# generate a string containing hexadecimal characters
PolyRand.hex(length)

# generate a string containing numbers and lowercase letters
# that are unambiguous when written down
PolyRand.fax(length)

# generate a string containing lowercase letters minus vowels
const symbolList = 'bcdfghjklmnpqrstvwxyz'
PolyRand.string(symbolList, length)

# generate random bytes in binary form
PolyRand.bytes(length)
```

PHP:
```php
<?php

require_once('vendor/autoload.php');
use PolyCrypto\PolyRand;

// generate a string containing numbers and letters minus vowels
// suitable for resources such as URLs with random strings 
PolyRand::slug($length);

// generate a string containing hexadecimal characters
PolyRand::hex($length);

// generate a string containing numbers and lowercase letters
// that are unambiguous when written down
PolyRand::fax($length);

// generate a string containing lowercase letters minus vowels
$symbolList = explode('', 'bcdfghjklmnpqrstvwxyz');
PolyRand::string($symbolList, $length);

// generate random bytes in binary form
PolyRand.bytes(length);
```

## Command line utilities

poly-crypto functions can be used in your Node project from the command line
using `npx` to invoke any of the following commands:

```bash
npx key:encrypt $key $dataToEncrypt
npx pass:encrypt $password $salt $dataToEncrypt
npx key:decrypt $key $stringToDecrypt
npx pass:decrypt $password $salt $stringToDecrypt
npx bcrypt:hash $password
npx bcrypt:verify $password $againstHash
npx hash:md5 $string
npx hash:sha1 $string
npx hash:sha256 $string
npx hash:sha512 $string
npx rand:bytes $length
npx rand:hex $length
npx rand:slug $length
npx rand:fax $length
npx rand:string $length $symbolString
```

## Browser usage

All poly-crypto modules do function in the browser. There are only a few use cases
where encrypting in the browser is a good idea. If you know what you are doing,
see the following section for instructions on importing a Poly* module.

## JavaScript direct import

If you are using [esm](https://www.npmjs.com/package/esm) or a bundler such as
[webpack](https://webpack.js.org/) you may import a single JavaScript module like so:
```js
import { PolyBcrypt } from './node_modules/poly-crypto/node/src/PolyBcrypt.js';
```

## Unit tests

```bash
# test all languages
npm run test-all

# PHP
./vendor/bin/kahlan --spec=php/tests

# NodeJS
npm test

# Python
pytest
```

## Contributing

## License

Open Source, under the [ISC](https://opensource.org/licenses/ISC) License.
