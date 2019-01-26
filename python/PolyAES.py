import base64
from Crypto import Random
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2

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

    @staticmethod
    def withKey(hexKey):
        """Return new PolyAES instance with the given key

        Args:
            hexKey (string): The 256-bit key in hexadecimal (should be 64 characters)

        Returns:
            PolyAES
        """
        binKey = hexKey.decode('hex')
        return PolyAES(binKey)

    @staticmethod
    def withPassword(password, salt, iterations=10000):
        """Return new Crypto instance with the given user-supplied password

        Args:
            password (string): The password from the user
            salt (string): An application secret
            numIterations (int): The number of iterations for the PBKDF2 hash. Defaults to 10000.

        Returns:
            PolyAES
	    """
        bytes = 32
        binKey = PBKDF2(password, salt, bytes, numIterations)
        return PolyAES(binKey)

    def encrypt(self, data):
        """Encrypt the given data

        Args:
            data (string): The string to encrypt

        Returns:
            string: The value encrypted and base64 encoded
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
	       data (string): Data encrypted with AES-256 GCM mode
           note: The first 16 characters must be the binary IV
	       note: The second 16 characters must be the binary GCM tag

        Returns:
            string
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
