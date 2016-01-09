/**
 * get memory usage info
 */

module.exports = {
    getUsage:function () {
        try {
            return process.memoryUsage();
        } catch (e) {
            return {};
        }
    }
};
