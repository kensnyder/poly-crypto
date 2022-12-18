#!/usr/bin/env node

const { PolyDigest } = require('../src/index.ts');

const [, , algo, data] = process.argv;
const digest = PolyDigest[algo](data);
process.stdout.write(digest);
