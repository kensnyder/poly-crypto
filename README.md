# poly-crypto

**Poly**glot **Crypto**graphy. High-level cryptographic functions that are interoperable between NodeJS, PHP 7.1+, and Python.

## Project Goals

1. Encryption and hashing functions for common app features that use security best practices
1. APIs that work exactly the same on NodeJS, PHP 7.1, and Python

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
| [Encrypt with key](#encrypt-with-key) | PolyAES.withKey(key).encrypt(data) | PolyAES::withKey($key)->encrypt($data) | 
| [Decrypt with key](#decrypt-with-key) | PolyAES.withKey(key).decrypt(encrypted) | PolyAES::withKey($key)->decrypt($encrypted) | 
| [Encrypt with password](#encrypt-with-password) | PolyAES.withPassword(password, salt).encrypt(data) | PolyAES::withPassword($password, $salt)->encrypt($data) |
| [Decrypt with password](#decrypt-with-password) | PolyAES.withPassword(password, salt).decrypt(encrypted) | PolyAES::withPassword($password, $salt)->decrypt($encrypted) |
| [Bcrypt hash](#hash-password) | PolyBcrypt.hash(password) | PolyBcrypt::hash($password) |
| [Bcrypt verify](#verify-password) | PolyBcrypt.verify(password, hash) | PolyBcrypt::verify($password, $hash) |
| [Hash functions](#hash-function) | PolyHash.sha256(data) | PolyHash::sha256($data) |
| [Random functions](#random-functions) | PolyRand.slug(length) | PolyRand::slug($length) |

## Table of Contents

1. [Technology choices](#technology-choices)
	1. [AES-255 GCM](#aes-256-gcm)
	1. [Bcrypt](#bcrypt)
	1. [Hashing](#hashing)
1. [Use Cases](#use-cases)	
1. [AES encryption](#aes-encryption)
	1. [Encrypt and decrypt with key](#encrypt-and-decrypt-with-key)
	1. [Encrypt and decrypt with password](#encrypt-and-decrypt-with-password)
1. [Bcrypt hashing](#bcrypt-hashing) 
	1. [Hash password](#hash-password)
	1. [Verify password](#verify-password)
1. [Hash functions](#hash-functions)
	1. [sha512](#sha512)	
	1. [sha256](#sha256)	
	1. [sha1](#sha1)	
	1. [md5](#md5)
1. [Random functions](#random-functions)
	1. [bytes](#bytes)
	1. [hex](#hex)
	1. [slug](#slug)
	1. [fax](#fax)
	1. [string](#string)
1. [Unit tests](#unit-tests)
2. [Open Source ISC Licence](#licence)

## Technology choices

### AES-256 GCM

As of January 2019, the most secure symmetric encryption that is available across PHP, NodeJS and Python is
AES-256 Encryption with GCM block mode. With the right arguments and options, these 3 libraries can decrypt 
one another's encrypted strings: Python's PyCryptodome, PHP 7.1's openssl_* functions and npm's node-forge.

### Bcrypt

As of January 2019, the industry standard for hashing passwords is bcrypt. These 3 libraries can hash and
verify one another's hashes: Python's bcrypt, PHP's password_hash function, npm's bcrypt-js

### Hashing

When one-way hashing is needed, sha256 and sha512 are good bets. PolyHash also provides md5 and sha1
hashing functions for working with existing systems that use those.

### urandom

Cryptographic randomness is hard. These 3 sources can provide good randomness: Python's os.urandom()
function, PHP's openssl_random_pseudo_bytes() function and Node's crypto.randomBytes() function.

## Use cases

poly-crypto's basic use cases:

|     | Case | Input | Output | NodeJS/Python |
| --- | ---- | ----- | ------ | ------------- |
| 1.  | Encrypt data that you can to decrypt later | Encryption key string | base-64 encoded string | PolyAES.withKey(hexKey).encrypt(data) |
| 2.  | Encrypt data for a user that he or she can decrypt later | User-supplied password & system salt | base-64 encoded string | PolyAES.withPassword(password, salt).encrypt(data) |
| 3.  | Hash passwords with bcrypt | Password string | bcrypt hash | PolyBcrypt.hash(password) |
| 4.  | Check if a password matches the given bcrypt hash | Password string & bcrypt hash | True if password matches | PolyBcrypt.verify(password, hash) |
| 5.  | Generate digest hashes (e.g. sha256) | String data | digest string | PolyHash.sha256(data) |
| 6.  | Generate random slugs | number of characters | a string with random characters | PolyRand.slug(numCharacters) |

### AES Encryption

#### Encrypt and decrypt with key

Key should be a 64 character hex-encoded string stored in a secure param store.
To generate a cryptographically secure random key, use `PolyAES.generateKey(64)`.

JavaScript:
```js
const { PolyAES } = require('poly-crypto');

const hexKey = '64-char hex encoded string from secure param store';
const encrypted = PolyAES.withKey(hexKey).encrypt(data); 
const decrypted = PolyAES.withKey(hexKey).decrypt(data); 
```

Python:
```python
import PolyAES

hexKey = '64-char hex encoded string from secure param store'
encrypted = PolyAES.withKey(hexKey).encrypt(data)
decrypted = PolyAES.withKey(hexKey).decrypt(data)
```

PHP:
```php
require_once('vendor/autoload.php');
use PolyCrypto/PolyAES;

$hexKey = '64-char hex encoded string from secure param store';
$encrypted = PolyAES::withKey($hexKey)->encrypt($data);
$decrypted = PolyAES::withKey($hexKey)->decrypt($encrypted);
```

#### Encrypt and decrypt with user password and system salt

```php
require_once('vendor/autoload.php');
use PolyCrypto/PolyAES;

$password = 'User-supplied password';
// store salt along side encrypted string or in a secure parameter store 
$salt = 'System-supplied salt 8+ characters long';
$encrypted = PolyAES::withPassword($password, $salt)->encrypt($data);
$decrypted = PolyAES::withPassword($password, $salt)->decrypt($encrypted);
```

### NodeJS

#### With Encryption Key

```js
const PolyJS = require('poly-aes');

// store hexKey in a secure parameter store
const hexKey = '64-char hex encoded string from secure param store';
const encrypted = PolyAES.withKey(hexKey).encrypt(data);
const decrypted = PolyAES.withKey(hexKey).decrypt(encrypted);
```

#### With Password and Salt

```js
const PolyJS = require('poly-aes');

const password = 'User-supplied password';
// store salt along side encrypted string or in a secure parameter store
const salt = 'System-supplied salt 8+ characters long';
const encrypted = PolyAES.withPassword(password, salt).encrypt(data);
const decrypted = PolyAES.withPassword(password, salt).decrypt(encrypted);
```

### Python

#### With Encryption Key

```python
import PolyAES

# store hexKey in a secure parameter store
hexKey = '64-char hex encoded string from secure param store'
encrypted = PolyAES.withKey(hexKey).encrypt(data)
decrypted = PolyAES.withKey(hexKey).decrypt(encrypted)
```

#### With Password and Salt

```python
import PolyAES

password = 'User-supplied password';
# store salt along side encrypted string or in a secure parameter store
salt = 'System-supplied salt 8+ characters long'
encrypted = PolyAES.withPassword(password, salt).encrypt(data)
decrypted = PolyAES.withPassword(password, salt).decrypt(encrypted)
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

## License

Open Source, under the [ISC](https://opensource.org/licenses/ISC) License.
