'use strict';
var net = require('net');
var Encryptor = require("../encrop/encrypt").Encryptor;
var server = net.createServer({
	port: 8080
}, function(socket) {
	console.log('socket connect');
	let encryptor = new Encryptor('Huangyao1', 'aes-256-cfb');
	let status = 0;
	let remote;
	let cmd;
	let addrtype;
	let remoteAddr;
	let addrToSend;
	let remotePort;
	let headerLength;
	let addrLen;
	let addrToSendBuf;
	let connected = false;
	socket.on('data', function(data) {
		console.log('status', status, data);
		if (status === 0)
		// +----+--------+
		// |VER | METHOD |
		// +----+--------+
		// | 1  |   1    |
		// +----+--------+
			socket.write(new Buffer([0x5, 0x0]));
		if (status === 1) {
			// +----+-----+-------+------+----------+----------+
			// |VER | CMD |  RSV  | ATYP | DST.ADDR | DST.PORT |
			// +----+-----+-------+------+----------+----------+
			// | 1  |  1  | X'00' |  1   | Variable |    2     |
			// +----+-----+-------+------+----------+----------+
			let buf = new Buffer([0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
			socket.write(buf);
			cmd = data[1];
			addrtype = data[3];
			if (addrtype === 3) {
				addrLen = data[4];
			}
			var addrToSend = data.slice(3, 4).toString("binary");
			if (addrtype === 1) {
				remoteAddr = utils.inetNtoa(data.slice(4, 8));
				addrToSend += data.slice(4, 10).toString("binary");
				remotePort = data.readUInt16BE(8);
				headerLength = 10;
			} else if (addrtype === 4) {
				remoteAddr = inet.inet_ntop(data.slice(4, 20));
				addrToSend += data.slice(4, 22).toString("binary");
				remotePort = data.readUInt16BE(20);
				headerLength = 22;
			} else {
				remoteAddr = data.slice(5, 5 + addrLen).toString("binary");
				addrToSend += data.slice(4, 5 + addrLen + 2).toString("binary");
				remotePort = data.readUInt16BE(5 + addrLen);
				headerLength = 5 + addrLen + 2;
			}
			addrToSendBuf = new Buffer(addrToSend, "binary");
			addrToSendBuf = encryptor.encrypt(addrToSendBuf);
			remote = net.connect('9183', '128.199.110.63');
			remote.on('data', function(data) {
				console.log('remote data', data.toString('utf8'));
				data = encryptor.decrypt(data);
				return  socket.write(data);
			});
			remote.on('end', function() {
				console.log('disconnected from remote');
			});
			remote.on('error',function (e) {
				console.log('remote error',e);
				socket.destroy();
			});
			remote.write(addrToSendBuf);
			if (data.length > headerLength) {
				let buf = new Buffer(data.length - headerLength);
				data.copy(buf, 0, headerLength);
				let piece = encryptor.encrypt(buf);
				remote.write(piece);
			}
			connected = true;
		}
		if (status >= 2) {
			while(!connected){
				process.nextTick();
			}
			data = encryptor.encrypt(data);
			remote.write(data);
		}
		status++;
	});
	socket.on('close', function() {
		console.log('sockets close');
	});
	socket.on('error',function (e) {
		console.log('socket error',e);
	});
	socket.setTimeout(6000,function () {
		console.log('sockets timeout');
		this.destroy();
	});
});

server.listen({
	port: 8080
}, function() {
	console.log('listen in 8080');
});
server.on('listening', function() {
	console.log('listening');
})
