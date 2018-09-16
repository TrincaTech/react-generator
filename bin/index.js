#!/usr/bin/env node

const program = require('commander');

const reactor = require("../lib/reactor");

program
    .command('generate <project-directory>')
    .alias('gen')
    .description('Generate a react app project')
    .action(function (projectDir) {
        reactor.generate(projectDir);
    });

program.parse(process.argv);
