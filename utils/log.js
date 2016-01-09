/**
 * tiny log queue
 */
'use strict';
var LEVEL = ['INFO','WARN','ERROR'];
class LogQueue {
    constructor(level,size) {
        this.level = level.toUpperCase() || 'INFO';
        this.size = size || 1000;
        this._cache = new Array(size);
    }
    push(level,data){
        if(this._cache.length < this.size){
            this._cache.push(data);
        }else{
            this._cache.shift();
            this._cache.push(data);
        }
    }
    get data(){
        return this._cache.reverse();
    }
}

module.exports = LogQueue;
