'use strict';
var Log = require('../utils/log');
var log = new Log();
var pre = process.memoryUsage().heapUsed;
var us;
for (let i = 0; i < 100000; i++) {
    log.push(i);
    if(i % 1000 === 0){
        us = process.memoryUsage().heapUsed
        console.log('memory increase',us-pre);
        pre = us;
    }
}
console.log(log._cache);
