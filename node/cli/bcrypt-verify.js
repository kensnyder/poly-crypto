#!/usr/bin/env node

const { PolyBcrypt } = require('../../index.js');
const doesMatch = PolyBcrypt.verify(process.argv[2], process.argv[3]);
process.stdout.write(doesMatch ? '1' : '0');
