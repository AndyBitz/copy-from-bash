#!/usr/bin/env node

const {spawn} = require('child_process');
const net     = require('net');
const {port}  = require('./config.js');
const help    = require('./help.js');

if (process.argv.indexOf('help') != -1) {
  help();
  process.exit();
};

if (process.argv.indexOf('listen') != -1) {
  const listen = spawn('node', [__dirname+'/listen.js'], {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore']
  });
  process.exit();
} else if (process.argv.indexOf('sent') != -1) {
  const options = {port: port, host: 'localhost'};
  const sent = {};

  if (process.argv.indexOf('--timer')) {
    sent.timer = process.argv[process.argv.indexOf('--timer')+1];
  }

  if (process.argv.indexOf('--text') != -1) {
    sent.text = process.argv[process.argv.indexOf('--text')+1];
    if (!sent.text) {
      console.error('no text was given');
      return;
    }
    const client  = net.connect(options, ()=>{
      client.end(JSON.stringify(sent));
    });
    client.on('error', err=>{
      console.log(`ERROR: check if your server is running or if your Port ${port} is already in use.`);
      console.error(err);
    });
  }
} else {
  help();
}