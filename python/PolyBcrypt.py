import bcrypt
import math
import re

"""
PolyBcrypt - to hash and verify passwords using bcrypt
"""

LENGTH_ERROR = 'PolyBcrypt: password must be 72 bytes or less'

COST_ERROR = 'PolyBcrypt: cost must be between 4 and 31'

def hash(password, cost=13):
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
    # Note that versions $2x$ and $2y$ are peculiar to PHP and equivalent to $2a$
    # See https://en.wikipedia.org/wiki/Bcrypt#Versioning_history
    version = hash[0:4]
    if (version == '$2x$' or version == '$2y$'):
        hash = '$2a$' + hash[4:]
    return bcrypt.hashpw(password, hash) == hash

def info(hash):
    """Get information about the given hash including version and cost

    Args:
        hash (str): The hash to parse

    Returns:
        dict: Object with keys valid, version, cost, salt and hash
    """
    match = re.match(r'^(\$..?\$)(\d\d)\$(.{22})(.{31})$', hash)
    if (match is None):
        return {
            'valid': False
        }
    else:
        return {
            'valid': True,
            'version': match.group(1),
            'cost': int(match.group(2)),
            'salt': match.group(3),
            'hash': match.group(4),
        }
