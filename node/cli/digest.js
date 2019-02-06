#!/usr/bin/env node

const { PolyDigest } = require('../../index.js');

const algo = process.argv[2];
const data = process.argv[3];
const digest = PolyDigest[algo](data);
process.stdout.write(digest);
