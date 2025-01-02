#!/usr/bin/env node

const { PolyRand } = require('../dist/index.cjs');

const [, , type, length] = process.argv;
const out = PolyRand[type](Number(length));
process.stdout.write(out);
