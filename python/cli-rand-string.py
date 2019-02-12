#!/usr/bin/env python

import sys
import PolyRand

try:
    _, length, symbols = sys.argv
    out = PolyRand.string(int(length), list(symbols))
    sys.stdout.write(out)
except Exception as e:
    sys.stderr.write(e.message)
    exit(1)
