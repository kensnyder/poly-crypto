import bcrypt
import math

"""
PolyBcrypt - to hash and verify passwords using bcrypt
"""

LENGTH_ERROR = 'PolyBcrypt: password must be 72 bytes or less'

COST_ERROR = 'PolyBcrypt: cost must be between 4 and 31'

def hash(password, cost=10):
    """Hash a password using bcrypt

    Args:
        password (str): The password to check
        cost (int): The compute cost (a logarithmic factor) between 4 and 31

    Returns:
        str: The hash string

    Raises:
        Exception if password is too long or cost is out of range
    """
    if (len(password) > 72):
		raise Exception(LENGTH_ERROR)
    cost = int(cost)
    if (math.isnan(cost) or cost < 4 or cost > 31):
        raise Exception(COST_ERROR)
    salt = bcrypt.gensalt(cost)
    return bcrypt.hashpw(password, salt)

def verify(password, hash):
    """Verify that the given password matches the given hash

    Args:
        password (str): The password to check
        hash (str): The hash the password should match

    Returns:
        boolean: True if the password is correct

    Raises:
        Exception if password is too long
    """
    if (len(password) > 72):
		raise Exception(LENGTH_ERROR)
    return bcrypt.hashpw(password, hash) == hash
