#!/usr/bin/env node

const { PolyDigest } = require('../dist/index.cjs');

const [, , algo, data] = process.argv;
const digest = PolyDigest[algo](data);
process.stdout.write(digest);
