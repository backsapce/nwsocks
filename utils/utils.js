module.exports = {
    resolveAddr:function (buf) {
        if(!buf) return null;
        var rs = [];
        for (var i = 0; i < buf.length; i++) {
            rs.push(Number(buf[i]));
        }
        return rs.join('.');
    }
};
