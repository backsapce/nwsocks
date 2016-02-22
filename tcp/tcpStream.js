'use strict';
var Transform = require('stream').Transform;
var util = require('util');
var debug = require('debug')('tcp');
var log = require('../utils/log');
var TCPStream = function (sockets,encryptor) {
    this.sockets = sockets;
	this.encryptor = encryptor || new Encryptor(global.config.passwd, global.config.method);
	this.status = 0;
	this.remote = undefined;
	this.cmd = undefined;
	this.addrtype = undefined;
	this.remoteAddr = undefined;
	this.addrToSend = undefined;
	this.remotePort = undefined;
	this.headerLength = undefined;
	this.addrLen = undefined;
	this.connected = false;
    this.status = 0;
    Transform.call(this);
}
util.inherits(TCPStream, Transform);
TCPStream.prototype._transform = function(data, encoding, done) {
    // +----+--------+
    // |VER | METHOD |
    // +----+--------+
    // | 1  |   1    |
    // +----+--------+
	if (this.status === 0){
		this.sockets.write(new Buffer([0x5, 0x0]));
    }
    // +----+-----+-------+------+----------+----------+
    // |VER | CMD |  RSV  | ATYP | DST.ADDR | DST.PORT |
    // +----+-----+-------+------+----------+----------+
    // | 1  |  1  | X'00' |  1   | Variable |    2     |
    // +----+-----+-------+------+----------+----------+
	if (this.status === 1) {
		let buf = new Buffer([0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
		this.sockets.write(buf);
		this.cmd = data[1];
		this.addrtype = data[3];
		if (this.addrtype === 3) {
			this.addrLen = data[4];
		}
		this.addrToSend = data.slice(3, 4).toString("binary");
		if (this.addrtype === 1) {
			this.remoteAddr = utils.inetNtoa(data.slice(4, 8));
			this.addrToSend += data.slice(4, 10).toString("binary");
			this.remotePort = data.readUInt16BE(8);
			this.headerLength = 10;
		} else if (this.addrtype === 4) {
			this.remoteAddr = inet.inet_ntop(data.slice(4, 20));
			this.addrToSend += data.slice(4, 22).toString("binary");
			this.remotePort = data.readUInt16BE(20);
			this.headerLength = 22;
		} else {
			this.remoteAddr = data.slice(5, 5 + this.addrLen).toString("binary");
			this.addrToSend += data.slice(4, 5 + this.addrLen + 2).toString("binary");
			this.remotePort = data.readUInt16BE(5 + this.addrLen);
			this.headerLength = 5 + this.addrLen + 2;
		}
        debug('connect to ' + this.remoteAddr + ':'+this.remotePort);
        log.push('connect to ' + this.remoteAddr + ':'+this.remotePort);
		let addrToSendBuf = new Buffer(this.addrToSend, "binary");
		addrToSendBuf = this.encryptor.encrypt(addrToSendBuf);
		this.push(addrToSendBuf);
		if (data.length > this.headerLength) {
			let buf = new Buffer(data.length - headerLength);
			data.copy(buf, 0, headerLength);
			let piece = this.encryptor.encrypt(buf);
			this.push(piece);
		}
		this.connected = true;
	}
	if (this.status >= 2) {
		while (!this.connected) {
			process.nextTick();
		}
		data = this.encryptor.encrypt(data);
		this.push(data);
	}
	this.status++;
    done();
}

// TCPStream.prototype._read = function (first_argument) {
//     // body...
// };
module.exports = TCPStream;
