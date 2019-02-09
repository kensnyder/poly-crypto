#!/usr/bin/env node

const { PolyRand } = require('../../index.js');

const [$0, $1, type, length] = process.argv;
const out = PolyRand[type](length);
process.stdout.write(out);
