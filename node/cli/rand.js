#!/usr/bin/env node

const { PolyRand } = require('../../index.js');
const type = process.argv[2];
const data = process.argv[3];
const out = PolyRand[type](data);
process.stdout.write(out);
