'use strict';
var config = require('./config.json') || {};
var debug = require('debug')('socks:main');
var server = require('./tcp/tcp.js');

function checkConfig(config) {
  let METHODS = [
    'aes-128-cfb',
    'aes-192-cfb',
    'aes-256-cfb',
    'bf-cfb',
    'camellia-128-cfb',
    'camellia-192-cfb',
    'camellia-256-cfb',
    'cast5-cfb',
    'des-cfb',
    'idea-cfb',
    'rc2-cfb',
    'rc4',
    'rc4-md5',
    'seed-cfb'
  ];
  if (!config) {
    throw new Error('config file not find');
  }
  if (!config.host) {
    config.host = '127.0.0.1';
  }
  if (!config.port) {
    config.port = '1080';
  }
  if (!config.local_port) {
    config.local_port = 8080;
  }
  if (!config.passwd) {
    config.passwd = '';
    console.log('WARNING', 'passwd is null,will encript with a null key');
  }
  if (!config.method) {
    config.method = 'aes-256-cfb';
    console.log('WARNING', 'method not defined,will use the default method aes-256-cfb');
  }
  if (!config.method in METHODS) {
    config.method = 'aes-256-cfb';
    console.log('WARNING', 'method not support,will use the default method aes-256-cfb');
  }
}

checkConfig(config);

if (global) {
  global.config = config;
}




module.exports = server;
