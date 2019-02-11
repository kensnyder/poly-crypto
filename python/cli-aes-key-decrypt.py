#!/usr/bin/env python

import sys
import PolyAES

try:
    _, key, ciphertext = sys.argv
    cipher = PolyAES.withKey(key)
    plaintext = cipher.decrypt(ciphertext)
    sys.stdout.write(plaintext)
except Exception as e:
    sys.stderr.write(e.message)
    exit(1)
