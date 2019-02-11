#!/usr/bin/env python

import sys
import PolyRand

_, type, length = sys.argv
out = getattr(PolyRand, type)(length)
sys.stdout.write(out)
