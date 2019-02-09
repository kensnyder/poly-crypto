#!/usr/bin/env python

import sys
import PolyAES

try:
    _, password, salt, ciphertext = sys.argv
    cipher = PolyAES.withPassword(password, salt)
    plaintext = cipher.decrypt(ciphertext)
    print plaintext
except Exception as e:
    sys.stderr.write(e.message)
    exit(1)
