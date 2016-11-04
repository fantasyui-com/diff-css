#!/usr/bin/env node

process.stdin.setEncoding('utf8');
const setup = require('commander');
const program = require('./program.js');
setup
  .version('1.0.0')
  .usage('[options] <old.css> <new.css>')
  .option('-r, --reporter <type>', 'reporter name [json|text]', 'text');

setup.parse(process.argv);
let data = null;
program(setup, data);
