'use strict';
var fs = require('fs-extra');
var config;
var server;
$(document).ready(function() {
	config = fs.readJsonSync('./configg.json');
	//render
	$('form').find('input[name=ip]').val(config.host);
	$('form').find('input[name=port]').val(config.port);
	$('form').find('input[name=local_port]').val(config.local_port);
	$('form').find('input[name=passwd]').val(config.passwd);
	$('form').find('select').val(config.method);
	$('#onServer').click(function(e) {
		if (server && server.isStart) {
			stop();
			return;
		}
		var ip = $('form').find('input[name=ip]').val();
		var port = $('form').find('input[name=port]').val();
		var local_port = $('form').find('input[name=local_port]').val();
		var passwd = $('form').find('input[name=passwd]').val();
		var method = $('form').find('select').val();
		if (!ValidateIPaddress(ip)) {
			$('form').find('input[name=ip]').addClass('warn');
			return;
		}
		if (+port != port) {
			$('form').find('input[name=port]').addClass('warn');
			return;
		}
		if (+local_port != local_port) {
			$('form').find('input[name=local_port]').addClass('warn');
			return;
		}
		config = {
			"host": ip,
			"port": port,
			"local_port": local_port,
			"passwd": passwd,
			"method": method
		};
		fs.writeJSON('./config.json', config, function() {
			//load server
			if (!server){
				server = require('../index.js');
            }
            if(!server.isStart){
                server.start();
            }
			server.on('listening', function() {
				$('#onServer').addClass('btn-warning');
				$('#onServer').html('off');
			});
		});
	});
});

function stop() {
	if (server) {
        server.clean();
	}
	$('#onServer').removeClass('btn-warning');
	$('#onServer').html('on');
}

function ValidateIPaddress(ipaddress) {
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
		return (true)
	}
	return (false)
}
