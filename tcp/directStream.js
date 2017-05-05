var Transform = require('stream').Transform;


class DirectStream extends Transform{
    constructor(sockets){
        super()
        this.sockets = sockets
    }
    _transform(data,encoding,done){

        this.push(data)
        done&&done()
    }
} 


module.exports=DirectStream

