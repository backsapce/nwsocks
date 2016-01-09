var server = require('../index.js');
setTimeout(function () {
    server.close();
}, 1000);
setTimeout(function () {
    server = require('../index.js');
}, 3000);
