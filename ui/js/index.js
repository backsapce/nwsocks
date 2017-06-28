'use strict';
var fs = require('fs-extra');
var log = require('../utils/log');
const {ipcRenderer} = require('electron')
var config;
var server;
$(document).ready(function() {
	fs.ensureFileSync('./config.json')
	config = fs.readJsonSync('./config.json');
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
		console.log(ip);
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
			if (!server) {
				server = require('../bootstrap.js');
			}
			if (!server.isStart) {
				server.start((e) => {
					if(e){
						console.error(e);
						return;
					}
				})
			}
			server.on('listening', function() {
				$('#onServer').addClass('btn-warning');
				$('#onServer').html('off');
			});
		});
	});
	// tray_init();
	init_log()
	registMsg()
});
//@deprecated
function tray_init() {
	// Load native UI library
	var gui = require('nw.gui');
	var win = gui.Window.get();


	// Create a tray icon
	var tray = new gui.Tray({
		// title: 'socks',
		icon: 'ui//img/icon.png'
	});

	// Give it a menu
	var menu = new gui.Menu();
	let toggle = new gui.MenuItem({
		type: 'checkbox',
		label: 'proxy'
	});
	if(server && server.isStart){
		toggle.checked = true;
		toggle.lable = 'on'
	}
	toggle.click = function () {
		$('#onServer').click();
		if(server && server.isStart){
			this.lable = 'on';
		}else{
			this.lable = 'off';
		}
	}
	menu.append(toggle);
	let showWinBtn = new gui.MenuItem({
		type: 'normal',
		label: 'show window'
	});
	showWinBtn.click = function () {
		win.show();
	}
	menu.append(showWinBtn);
	let exitBtn = new gui.MenuItem({
		type: 'normal',
		label: 'exit'
	});
	exitBtn.click = function () {
		process.exit(0);
	};
	menu.append(exitBtn);
	tray.menu = menu;


	// overload close event
	win.on('close', function() {
		this.hide();
	});
}

function stop() {
	if (server) {
		server.clean();
	}
	$('#onServer').removeClass('btn-warning');
	$('#onServer').html('on');
}

function registMsg() {
	ipcRenderer.on('proxy', () => {
		$('#onServer').click()
	})
}

function ValidateIPaddress(ipaddress) {
	if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ipaddress)) {
		return (true)
	}
	return (false)
}
window.test = 'test'
function init_log() {
	$('#log').click(function (e) {
		$('#log-tab').removeClass('tab-hidden');
		log.add_hook('log-tab',add_log);
	});
	$('.icon-x').click(function (e) {
		$('#log-tab').addClass('tab-hidden');
		log.remove_hook('log-tab');
	});
	/**
	 * add log item
	 */
	function add_log(log) {
		$('#log-list').prepend('<li>'+log+'</li>');
	}
}
