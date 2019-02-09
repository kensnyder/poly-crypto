#!/usr/bin/env python

import sys
import PolyRand

try:
    _, length, symbols = sys.argv
    out = PolyRand.string(length, list(symbols))
    print out
except Exception as e:
    sys.stderr.write(e.message)
    exit(1)
