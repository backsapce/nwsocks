/**
 * tiny log queue
 */
'use strict';
var LEVEL = ['INFO', 'WARN', 'ERROR'];
class LogQueue {
	constructor(level, size) {
		this.level = level || 'INFO';
		this.size = size || 1000;
		this._cache = new Array(size);
        this.hook = new Array();
	}
	push(data) {
		if (this._cache.length < this.size) {
			this._cache.push(data);
		} else {
			this._cache.shift();
			this._cache.push(data);
		}
        this._call_hooks(data);
	}
	get data() {
		return this._cache.reverse();
	}
    /**
     * add hook function.call when push a log
     */
	add_hook(id,cb) {
        for (let i = 0; i < this.hook.length; i++) {
            if(this.hook[i].id === id) return;
        }
        this.hook.push({id:id,cb:cb});
	}
    /**
     * remove hook via id
     */
    remove_hook(id) {
        this.hook.forEach(function (v,k) {
            if(v.id == id){
                this.hook[k].slice(k,1);
            }
        });
    }
    /**
     * intenal function . DO NOT CALL outside
     */
    _call_hooks(log){
        this.hook.forEach(function (v,k) {
            v.cb(log);
        });
    }
}

var _log = new LogQueue();
module.exports = _log;
