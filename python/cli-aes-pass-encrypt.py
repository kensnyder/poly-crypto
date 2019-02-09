#!/usr/bin/env python

import sys
import PolyAES

try:
    _, password, salt, plaintext = sys.argv
    cipher = PolyAES.withPassword(password, salt)
    ciphertext = cipher.encrypt(plaintext)
    print ciphertext
except Exception as e:
    sys.stderr.write(e.message)
    exit(1)
