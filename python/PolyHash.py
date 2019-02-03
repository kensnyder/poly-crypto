import hashlib

"""
Calculate hashes of strings
"""

def md5(data):
    """Calculate the md5 hash of a string
    Args:
        data (str): The string to digest

    Returns:
        string: The digest in hexadecimal
    """
    return hashlib.md5(data).hexdigest()

def sha1(data):
    """Calculate the sha1 hash of a string
    Args:
        data (str): The string to digest

    Returns:
        string: The digest in hexadecimal
    """
    return hashlib.sha1(data).hexdigest()

def sha256(data):
    """Calculate the sha256 hash of a string
    Args:
        data (str): The string to digest

    Returns:
        string: The digest in hexadecimal
    """
    return hashlib.sha256(data).hexdigest()

def sha512(data):
    """Calculate the sha512 hash of a string
    Args:
        data (str): The string to digest

    Returns:
        string: The digest in hexadecimal
    """
    return hashlib.sha512(data).hexdigest()
