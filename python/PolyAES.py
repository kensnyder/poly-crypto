import base64
import re
import os
from Crypto import Random
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2

KEY_FORMAT_ERROR = 'PolyAES: key must be 64-character hexadecimal string.'

SALT_SIZE_ERROR = 'PolyAES: salt must be 8+ characters.'

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
        return base64.b64encode(iv + tag + ciphertext)

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
        bytes = base64.b64decode(data)
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

    def __init__(self, binKey):
        """Create using a binary key"""
        self._key = binKey

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
