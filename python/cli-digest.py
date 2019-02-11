#!/usr/bin/env python

import sys
import PolyDigest

_, algo, data = sys.argv
out = getattr(PolyDigest, algo)(data)
sys.stdout.write(out)
