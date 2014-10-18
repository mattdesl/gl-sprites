var createTex = require('gl-texture2d')
var loadImage = require('img')

function noop() {}

module.exports = function(gl, opt, cb) {
    if (typeof opt === 'string') {
        var s = opt
        opt = { src: s }
    }
    opt = opt||{}
    cb = cb||noop

    if (!opt.src)
        throw new Error("must specify src for gl-load-texture")

    return loadImage(opt.src, function(err, img) {
        if (err)
            return cb(err)
                
        var t = createTex(gl, img)
        if (opt.wrap)
            t.wrap = opt.wrap
        if (opt.minFilter)
            t.minFilter = opt.minFilter
        if (opt.magFilter)
            t.magFilter = opt.magFilter 
        
        cb(null, t)
    })
}