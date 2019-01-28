# PolyAES

Encrypt and decrypt data with AES-256 GCM; interoperable with NodeJS, PHP 7.1+, and Python.

## Installation

```bash
# PHP
composer install poly-aes

# NodeJS
npm install --save poly-aes

# Python
pip install poly-aes
```

## Usage

PolyAES is designed for 2 basic use cases.

1. Encrypt data that you would like to decrypt later. 
You'll need to store an encryption key in a safe place such as a secure parameter store.
2. Encrypt data that a user would like to encrypt later.
You'll need to store and supply salt, and the user supplies the password.
You can store the data without knowing what it is. This way, only the
user who created the password can decrypt the data. For best results, use
a different salt for each piece of data.

### PHP

#### With Encryption Key

```php
use PolyCrypto/PolyAES;

// store hexKey in a secure parameter store
$hexKey = '64-char hex encoded string from secure param store';
$encrypted = PolyAES::withKey($hexKey)->encrypt($data);
$decrypted = PolyAES::withKey($hexKey)->decrypt($encrypted);
```

#### With Password and Salt

```php
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

## Run unit tests

```bash
# PHP
./vendor/bin/kahlan --spec=php/tests

# NodeJS
npm test

# Python
pytest
```

## License

Open Source, under the [ISC](https://opensource.org/licenses/ISC) License.
