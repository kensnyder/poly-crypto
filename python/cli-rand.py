#!/usr/bin/env python

import sys
import PolyRand

_, type, length = sys.argv
out = PolyRand[type](length)
print out
