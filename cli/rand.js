#!/usr/bin/env node

const { PolyRand } = require('../src/index.ts');

const [, , type, length] = process.argv;
const out = PolyRand[type](Number(length));
process.stdout.write(out);
