#!/usr/bin/env node

const { PolyRand } = require('../../index.js');

const type = process.argv[2];
const length = process.argv[3];
const out = PolyRand[type](length);
process.stdout.write(out);
