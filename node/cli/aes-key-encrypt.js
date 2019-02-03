#!/usr/bin/env node

const { PolyAES } = require('../../index.js');
const cipher = PolyAES.withKey(process.argv[2]);
const plaintext = cipher.decrypt(process.argv[3]);
process.stdout.write(plaintext);
