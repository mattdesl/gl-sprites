var mixes = require('mixes')
var createShader = require('gl-basic-shader')
var createBatch = require('gl-sprite-batch')
var createWhiteTex = require('gl-white-texture')
var copy2 = require('./copy2')
var number = require('as-number')

var mat4 = {
    ortho: require('gl-mat4/ortho'),
    identity: require('gl-mat4/identity'),
    create: require('gl-mat4/create')
}

var ZERO = [0, 0]
var TEXCOORD_DEFAULT = [0, 0, 1, 1]

var tmp1 = [0, 0],
    tmp2 = [0, 0]

function SpriteRenderer(gl, opt) {
    if (!(this instanceof SpriteRenderer))
        return new SpriteRenderer(gl, opt)
    opt = opt||{}

    this.gl = gl
    this.defaultShader = opt.defaultShader || createShader(gl, {
        color: true,
        texcoord: true
    })
    this.projection = mat4.create()

    this.color = [1, 1, 1, 1]
    this.whiteTexture = createWhiteTex(gl)
    this.batch = opt.batch || createBatch(gl, { premultiplied: true })
}


mixes(SpriteRenderer, {

    ortho: function(width, height) {
        mat4.ortho(this.projection, 0, width, height, 0, 0, 1)
        this.updateUniforms()
    },

    solid: function() {
        this.batch.texture = this.whiteTexture
        return this
    },

    reset: function() {
        this.batch.reset()
        this.batch.color = this.color
        return this
    },

    flush: function() {
        this.batch.flush()
        return this
    },

    drawRect: function(position, shape) {
        this.reset() //could be optimized
        this.batch.position = position
        this.batch.shape = shape
        this.batch.push()
    },

    strokeRect: function(position, shape, thickness) {
        thickness = number(thickness, 1)
        var x = position[0],
            y = position[1],
            width = shape[0],
            height = shape[1]
            
        //could be optimized...
        this.drawRect(copy2(tmp1, x, y), copy2(tmp2, width, thickness))
        this.drawRect(copy2(tmp1, x, y), copy2(tmp2, thickness, height))
        this.drawRect(copy2(tmp1, x, y+height-thickness), copy2(tmp2, width, thickness))
        this.drawRect(copy2(tmp1, x+width-thickness, y), copy2(tmp2, thickness, height))
    },
    
    drawLine: function(start, end, thickness) {
        thickness = number(thickness, 1)
        var x1 = start[0],
            y1 = start[1],
            x2 = end[0],
            y2 = end[1],
            dx = x2-x1,
            dy = y2-y1

        var dist = Math.sqrt(dx*dx + dy*dy)
        var rad = Math.atan2(dy, dx)
        this.batch.rotation = rad
        this.drawRect(copy2(tmp1, x1, y1), copy2(tmp2, dist, thickness))
        this.batch.rotation = 0
    },

    drawImage: function(image, position, shape, texcoord, rotation, rotationOrigin) {
        this.reset()
        this.image(image, texcoord)
        this.batch.rotation = rotation||0
        if (rotationOrigin)
            this.batch.rotationOrigin = rotationOrigin
        this.batch.position = position
        this.batch.shape = shape || image.shape || ZERO
        this.batch.push()
    },

    white: function() {
        //use gl-vec4
        this.color[0] = this.color[1] = this.color[2] = this.color[3] = 1
    },

    image: function(image, texcoord) {
        this.batch.texture = image
        this.batch.texcoord = texcoord || TEXCOORD_DEFAULT
    },

    bind: function() {
        var gl = this.gl
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        
        this.batch.bind(this.defaultShader)
        this.solid()
    },

    unbind: function() {
        this.batch.unbind()
    },

    updateUniforms: function() {
        this.defaultShader.bind()
        this.defaultShader.uniforms.projection = this.projection
    }
})

module.exports = SpriteRenderer