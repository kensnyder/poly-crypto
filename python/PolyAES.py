import base64
import re
import os
from Crypto import Random
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2

# Exception message when key is not in correct format
KEY_FORMAT_ERROR = 'PolyAES: key must be 64-character hexadecimal string.'

# Exception message when salt is too short
SALT_SIZE_ERROR = 'PolyAES: salt must be 8+ characters.'

# Exception message when encoding is set to an invalid value
ENCODING_ERROR = 'PolyAES: encoding must be base64, hex, or bin.'

# Default value for self._encoding
DEFAULT_ENCODING = 'base64'

class PolyAES(object):
    """Service for encrypting and decrypting data with openssl

    Compatible with npm's CryptoJS and PHP's openssl_encrypt()

    Examples:
        # store hexKey in a secure parameter store
        hexKey = '64-char hex encoded string from secure param store'
        encrypted = PolyAES.withKey(hexKey).encrypt(data)
        decrypted = PolyAES.withKey(hexKey).decrypt(encrypted)

        password = 'User-supplied password'
        salt = 'System-supplied salt 8+ characters long'
        encrypted = PolyAES.withPassword(password, salt).encrypt(data)
        decrypted = PolyAES.withPassword(password, salt).decrypt(encrypted)
    """

    def __init__(self, binKey):
        """Instantiate using a binary key"""
        self._key = binKey
        self.setEncoding(DEFAULT_ENCODING);

    def setEncoding(self, encoding):
        """After encryption, use base64 encoding, hexadecimal or binary

        Args:
            encoding (str): One of: base64, hex, bin

        Returns:
            PolyAES
        """
        allowed = ['base64', 'hex', 'bin']
        if encoding not in allowed:
            raise Exception(ENCODING_ERROR)
        self._encoding = encoding
        return self

    def getEncoding(self):
        """Get the current encoding type

        Returns:
            str: One of: base64, hex, bin
        """
        return self._encoding

    def _binToStr(self, bin):
        """Encode encrypted bytes using the current encoding

        Args:
            bin (str): The ciphertext in binary

        Returns:
            str: The encoded ciphertext
        """
        if self._encoding == 'bin':
            return bin
        elif self._encoding == 'base64':
            return base64.b64encode(bin)
        elif self._encoding == 'hex':
            return bin.encode('hex')

    def _strToBin(self, str):
        """Decode encrypted bytes using the current encoding

        Args:
            bin (str): The encoded ciphertext

        Returns:
            str: The ciphertext in binary
        """
        if self._encoding == 'bin':
            return str
        elif self._encoding == 'base64':
            return base64.b64decode(str)
        elif self._encoding == 'hex':
            return str.decode('hex')

    def encrypt(self, data):
        """Encrypt the given data

        Args:
            data (str): The string to encrypt

        Returns:
            str: The value encrypted and base64 encoded
        """
        mode = AES.MODE_GCM
        iv = Random.new().read(128 / 8)
        cipher = AES.new(self._key, mode, iv)
        ciphertext = cipher.encrypt(data)
        tag = cipher.digest()
        return self._binToStr(iv + tag + ciphertext)

    def decrypt(self, data):
        """Decrypt the given data

        Args:
	       data (str): Data encrypted with AES-256 GCM mode
           note: The first 16 characters must be the binary IV
	       note: The second 16 characters must be the binary GCM tag

        Returns:
            str
        """
        mode = AES.MODE_GCM
        bytes = self._strToBin(data)
        iv = bytes[:16]
        tag = bytes[16:32]
        ciphertext = bytes[32:]
        cipher = AES.new(self._key, mode, iv)
        plaintext = cipher.decrypt(ciphertext)
        try:
            cipher.verify(tag)
            return plaintext
        except Exception as e:
            return false

def withKey(hexKey):
    """Return new PolyAES instance with the given key

    Args:
        hexKey (str): The 256-bit key in hexadecimal (should be 64 characters)

    Returns:
        PolyAES
    """
    if (re.match('^[A-F0-9]{64}$', hexKey, flags=re.I) is None):
        raise Exception(KEY_FORMAT_ERROR)
    binKey = hexKey.decode('hex')
    return PolyAES(binKey)

def withPassword(password, salt, numIterations=10000):
    """Return new Crypto instance with the given user-supplied password

    Args:
        password (str): The password from the user
        salt (str): An application secret
        numIterations (int): The number of iterations for the PBKDF2 hash. Defaults to 10000.

    Returns:
        PolyAES
    """
    if (len(salt) < 8):
        Error(SALT_SIZE_ERROR)
    bytes = 32
    binKey = PBKDF2(password, salt, bytes, numIterations)
    return PolyAES(binKey)

def generateKey(length=64):
    """Generate key to use with PolyAES.withKey()

    Args:
        length (int): The character length of the key

    Returns:
        string: The key in hexadecimal
	"""
    return os.urandom(length / 2).encode('hex')

def generateSalt(length=64):
    """Generate salt to use with PolyAES.withPassword()

    Args:
        length (int): The character length of the salt

    Returns:
        string: The salt in hexadecimal
	"""
    return os.urandom(length / 2).encode('hex')
