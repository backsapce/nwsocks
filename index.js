/**
 * you can run node index.js to start in console mode
 */
const server = require('./bootstrap.js');
server.start();
console.log('process id', process.pid);
