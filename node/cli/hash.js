#!/usr/bin/env node

const { PolyHash } = require('../../index.js');
const algo = process.argv[2];
const data = process.argv[3];
const hash = PolyHash[algo](data);
process.stdout.write(hash);
