#!/usr/bin/env node

process.stdin.setEncoding('utf8');
const setup = require('commander');
const program = require('./program.js');
setup .version('1.0.0');
setup.parse(process.argv);
let data = null;
program(setup, data);
