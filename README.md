# poly-crypto

**Poly**glot **Crypto**graphy. High-level cryptographic functions that are
interoperable between NodeJS and PHP 7.1+.

[![NPM Link](https://img.shields.io/npm/v/poly-crypto?v=2.0.5)](https://npmjs.com/package/poly-crypto)
[![Packagist Link](https://img.shields.io/packagist/php-v/poly-crypto/poly-crypto/2.0.5)](https://packagist.org/packages/poly-crypto/poly-crypto)
[![Build Status](https://travis-ci.org/kensnyder/poly-crypto.svg?branch=master&v=2.0.5)](https://travis-ci.org/kensnyder/poly-crypto)
[![Code Coverage](https://codecov.io/gh/kensnyder/poly-crypto/branch/master/graph/badge.svg?v=2.0.5)](https://codecov.io/gh/kensnyder/poly-crypto)
[![ISC License](https://img.shields.io/npm/l/poly-crypto.svg?v=2.0.5)](https://opensource.org/licenses/ISC)

## Project Goals

1. APIs that work exactly the same on NodeJS and PHP 7.1+
1. Package for Node that can be used on serverless functions without external C
   bindings
1. Two-way symmetric encryption with a key or with password and salt
1. Password hashing

## Installation

```bash
# NodeJS
npm install --save poly-crypto

# PHP
composer require poly-crypto

```

## Cheatsheet

| Section                                                     | NodeJS                                                  | PHP                                                          |
| ----------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| [Encrypt with key](#encrypt-and-decrypt-with-key)           | PolyAES.withKey(key).encrypt(data)                      | PolyAES::withKey($key)->encrypt($data)                       |
| [Decrypt with key](#encrypt-and-decrypt-with-key)           | PolyAES.withKey(key).decrypt(encrypted)                 | PolyAES::withKey($key)->decrypt($encrypted)                  |
| [Encrypt with password](#encrypt-and-decrypt-with-password) | PolyAES.withPassword(password, salt).encrypt(data)      | PolyAES::withPassword($password, $salt)->encrypt($data)      |
| [Decrypt with password](#encrypt-and-decrypt-with-password) | PolyAES.withPassword(password, salt).decrypt(encrypted) | PolyAES::withPassword($password, $salt)->decrypt($encrypted) |
| [Bcrypt hash](#password-hashing)                            | PolyBcrypt.hash(password)                               | PolyBcrypt::hash($password)                                  |
| [Bcrypt verify](#password-hashing)                          | PolyBcrypt.verify(password, hash)                       | PolyBcrypt::verify($password, $hash)                         |
| [Digest functions](#digest-functions)                       | PolyDigest.sha256(data)                                 | PolyDigest::sha256($data)                                    |
| [Random functions](#random-functions)                       | PolyRand.slug(length)                                   | PolyRand::slug($length)                                      |

## Table of Contents

1. [Technology choices](#technology-choices)
    1. [AES-255 GCM](#aes-256-gcm)
    1. [Bcrypt](#bcrypt)
    1. [Randomness](#randomness)
1. [Use Cases](#use-cases)
1. [Misuse](#misuse)
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
1. [Changelog](https://github.com/kensnyder/poly-crypto/blob/master/CHANGELOG.md)

## Technology choices

### AES-256 GCM

As of March 2021, AES-256 Encryption with GCM block mode is a reputable and
secure method that is available across PHP and NodeJS without any extensions.
With the right arguments and options, these 2 languages can decrypt one
another's encrypted strings using PHP's openssl\_\* functions and npm's
node-forge.

### Bcrypt

As of March 2021, Bcrypt password hashing is reputable and secure. These 2
languages can hash and verify one another's hashes: npm's bcrypt-js and PHP's
password_hash function.

### Randomness

Cryptographic randomness is tricky. These 2 languages can provide secure
randomness:
PHP's random_bytes() and Node's crypto.randomBytes() functions.

## Use cases

poly-crypto's basic use cases:

|     | Case                                                     | Input                                | Output                          | NodeJS                                             |
| --- | -------------------------------------------------------- | ------------------------------------ | ------------------------------- | -------------------------------------------------- |
| 1.  | Encrypt data that you can to decrypt later               | Encryption key string                | base-64 encoded string          | PolyAES.withKey(hexKey).encrypt(data)              |
| 2.  | Encrypt data for a user that he or she can decrypt later | User-supplied password & system salt | base-64 encoded string          | PolyAES.withPassword(password, salt).encrypt(data) |
| 3.  | Hash passwords with bcrypt                               | Password string                      | bcrypt hash                     | PolyBcrypt.hash(password)                          |
| 4.  | Check if a password matches the given bcrypt hash        | Password string & bcrypt hash        | True if password matches        | PolyBcrypt.verify(password, hash)                  |
| 5.  | Calculate digests (e.g. sha256)                          | String data                          | digest string                   | PolyDigest.sha256(data)                            |
| 6.  | Generate random slugs                                    | number of characters                 | a string with random characters | PolyRand.slug(numCharacters)                       |

## Misuse

1. **File encryption.** poly-crypto modules are not meant to be used to encrypt
   entire files. You'll want to use a C-based library that is designed to
   encrypt large amounts of data quickly. For example, consider the following:
    1. poly-crypto is not fast for large files.
    1. AES-256 GCM encryption can be parallelized in languages that support
       threading for faster processing
1. **Streaming data.** PolyAES is not designed to encrypt streaming data.
1. **Secure key storage.** If you store encryption keys or user passwords in
   plain text, encryption will not provide protection. You'll want to store keys
   in secure parameter store.
1. **Digests for passwords.** Do not use md5 or any sha digest for hashing
   passwords, even if you use salt. PolyBcrypt is the only poly-crypto module
   designed for hashing passwords.

### AES Encryption

#### Encrypt and decrypt with key

**Note:** key should be a 64-character hex-encoded string stored in a secure
param store. To generate a cryptographically secure random key,
use `PolyAES.generateKey(64)`.

NodeJS:

```js
const { PolyAES } = require('poly-crypto');

const hexKey = '64-char hex encoded string from secure param store';
const encrypted = PolyAES.withKey(hexKey).encrypt(data);
const decrypted = PolyAES.withKey(hexKey).decrypt(encrypted);
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

**Note:** You can re-use the "cipher" object. For example:

NodeJS:

```js
const { PolyAES } = require('poly-crypto');

const hexKey = '64-char hex encoded string from secure param store';
const cipher = PolyAES.withKey(hexKey);
const encrypted = cipher.encrypt(data);
const decrypted = cipher.decrypt(encrypted);
```

PHP:

```php
<?php

require_once('vendor/autoload.php');
use PolyCrypto\PolyAES;

$hexKey = '64-char hex encoded string from secure param store';
$cipher = PolyAES::withKey($hexKey);
$encrypted = $cipher->encrypt($data);
$decrypted = $cipher->decrypt($encrypted);
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

**Note:** You can re-use the "cipher" as an object.

### Password hashing

Bcrypt hashes are designed to store user passwords with a max length of 72
bytes. If a longer string is passed, an exception will be thrown. Keep in mind
that Unicode characters require multiple bytes.

Bcrypt conveniently stores salt along with the password. That ensures that
identical passwords will get different hashes. As such, you cannot compare two
hashes, you must use the `PolyBcrypt.verify()` function to see if the given
password matches the hash you have on record.

NodeJS:

```js
const { PolyBcrypt } = require('poly-crypto');

const password = 'Password from a user';
const hash = PolyBcrypt.hash(password);
const isCorrect = PolyBcrypt.verify(password, hash);
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
const { PolyDigest } = require('poly-crypto');

PolyDigest.sha512(data);
PolyDigest.sha256(data);
PolyDigest.sha1(data);
PolyDigest.md5(data);
```

PHP:

```php
<?php

require_once('vendor/autoload.php');
use PolyCrypto\PolyDigest;

PolyDigest::sha512($data);
PolyDigest::sha256($data);
PolyDigest::sha1($data);
PolyDigest::md5($data);
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
PolyRand.string(length, symbolList);

// generate random bytes in binary form
PolyRand.bytes(length);
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
PolyRand::string($length, $symbolList);

// generate random bytes in binary form
PolyRand::bytes($length);
```

## Command line utilities

poly-crypto functions can be used from the command line if Node JS is installed.

### Global install of poly-crypto

You'll have the following commands as symlinks:

```bash
# Global install command and arguments    # JavaScript equivalent
# --------------------------------------  # ---------------------
key-encrypt $hexKey $plaintext            # PolyAES.withKey(hexKey).encrypt(plaintext)
key-decrypt $hexKey $ciphertext           # PolyAES.withKey(hexKey).decript(ciphertext)
pass-encrypt $password $salt $plaintext   # PolyAES.withPassword(password, salt).encrypt(plaintext)
pass-decrypt $password $salt $ciphertext  # PolyAES.withPassword(password, salt).decrypt(plaintext)
bcrypt-hash $password                     # PolyBcrypt.hash(password)
bcrypt-verify $password $againstHash      # PolyBcrypt.verify(password, againstHash)
poly-digest $algo $string                 # PolyDigest[algo](data) where algo is one of: sha1, sha256, sha512, md5
poly-rand $type $length                   # PolyRand[type](length) where type is one of: slug, hex, fax, bytes
poly-rand-string $length $symbolString    # PolyRand.string(length, symbolList) where symbolList is a string containing allowed characters
```

### Local install of poly-crypto

Prefix each of the commands above with `npm exec`.

## Browser usage

All poly-crypto modules do indeed function in the browser. There are only a few use
cases where encrypting in the browser is a good idea. If you have a good reason to
use poly-crypto in the browser, see the following section for instructions on
directly importing a Poly\* module.

## JavaScript direct import

If you are using [esm](https://www.npmjs.com/package/esm) or a bundler such as
[webpack](https://webpack.js.org/) or [parcel](https://parceljs.org/)
you may import a single JavaScript module like so:

```js
import { PolyBcrypt } from 'poly-crypto/node/src/PolyBcrypt.js';
```

## Unit tests

```bash
# test both languages
npm run test:all

# PHP
./vendor/bin/kahlan --spec=php/tests

# NodeJS
npm test
```

## Contributing

Contributions welcome! See
[CONTRIBUTING.md](https://github.com/kensnyder/poly-crypto/blob/master/CONTRIBUTING.md)
.

## License

Open Source, under the [ISC License](https://opensource.org/licenses/ISC).
