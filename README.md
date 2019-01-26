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

### PHP

#### With Encryption Key

```php
// store hexKey in a secure parameter store
$hexKey = '64-char hex encoded string from secure param store';
$encrypted = PolyAES::withKey($hexKey)->encrypt($data);
$decrypted = PolyAES::withKey($hexKey)->decrypt($encrypted);
```

#### With Password and Salt

```php
$password = 'User-supplied password';
// store salt in a secure parameter store
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
// store salt in a secure parameter store
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
# store salt in a secure parameter store
salt = 'System-supplied salt 8+ characters long'
encrypted = PolyAES.withPassword(password, salt).encrypt(data)
decrypted = PolyAES.withPassword(password, salt).decrypt(encrypted)
```

## License

[ISC](https://opensource.org/licenses/ISC)
