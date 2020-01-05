import os
import re
for roots, dirs, files in os.walk("."):
    if re.match(".*dist-info", roots):
        if "METADATA" not in files:
            print(roots)
