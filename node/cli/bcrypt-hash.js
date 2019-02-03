#!/usr/bin/env node

const { PolyBcrypt } = require('../../index.js');
const password = process.argv[2];
const cost = process.argv[3];
const hash = PolyBcrypt.hash(password, cost);
process.stdout.write(hash);
