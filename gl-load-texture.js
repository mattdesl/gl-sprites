var createTex = require('gl-texture2d')

module.exports = function(gl, opt, cb) {
    if (typeof opt === 'string') {
        var s = opt
        opt = { src: s }
    }
    opt = opt||{}

}