#!/usr/bin/env node

const { PolyDigest } = require('../index.js');

const [, , algo, data] = process.argv;
const digest = PolyDigest[algo](data);
process.stdout.write(digest);
