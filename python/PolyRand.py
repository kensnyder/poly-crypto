import os

"""
Functions to generate random strings
"""

SYMBOL_LIST_ERROR = 'PolyRand: Symbol list must contain between 2 and 256 characters.'

SLUG_SYMBOL_LIST = ['0','1','2','3','4','5','6','7','8','9','b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z','B','C','D','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','W','X','Y','Z']

FAX_SYMBOL_LIST = ['3','4','6','7','b','c','d','f','h','j','k','m','n','p','q','r','t','v','w','x','y']

def bytes(length):
    """Create a string of the given length with random bytes

    Args:
        length (int): The desired length with hexidecimal characters

    Returns:
        str: The random string
    """
	return os.urandom(length)

def hex(length):
    """Create a string of the given length with random bytes

    Args:
        length (int): The desired length

    Returns:
        str: The random string
    """
	return bytes(length / 2).encode('hex')

def slug(length):
    """Create a string of the given length with numbers, letters, but no vowels

    Args:
        length (int): The desired length

    Returns:
        str: The bytes as a string
    """
	return string(SLUG_SYMBOL_LIST, length)

def fax(length):
    """Create a string of the given length with numbers and lowercase letters that are unambiguious when written down

    Args:
        length (int): The desired length

    Returns:
        str: The bytes as a string
    """
	return string(FAX_SYMBOL_LIST, length)

def string(symbolList, length):
    """Create a string of the given length with random bytes

    Args:
        length (int): The desired length

    Returns:
        str: The random string

    Throws:
        Exception: if size of symbolList is not between 2 and 256
    """
	randomBytes = bytes(length)
	if (len(symbolList) < 2 || len(symbolList) > 256):
		raise Exception(SYMBOL_LIST_ERROR)
	numSymbols = len(symbolList)
	output = ''
	for chr in randomBytes:
		output += symbolList[ord(chr) % numSymbols]
	return output