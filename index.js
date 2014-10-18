var mixes = require('mixes')
var createShader = require('gl-basic-shader')
var createBatch = require('gl-sprite-batch')
var copy2 = require('./copy').vec2
var number = require('as-number')
var xtend = require('xtend')
var texcoord = require('texcoord')
var mat4 = require('./mat4')

var ZERO = [0, 0]
var TEXCOORD_DEFAULT = [0, 0, 1, 1]

var tmp1 = [0, 0],
    tmp2 = [0, 0],
    tmpUV = [0, 0, 1, 1]

function SpriteRenderer(gl, opt) {
    if (!(this instanceof SpriteRenderer))
        return new SpriteRenderer(gl, opt)
    opt = opt||{}

    this.gl = gl
    this.defaultShader = opt.defaultShader || createShader(gl, {
        color: true,
        texcoord: true
    })
    this.batch = opt.batch || createBatch(gl, xtend(opt, { premultiplied: true }))

    this.projection = mat4.create()
    this.view = mat4.create()
    this.transform = mat4.create()
    this.transformStack = []

    this.color = [1, 1, 1, 1]
}

mixes(SpriteRenderer, {

    transform: {
        get: function() {
            return this.batch.transform
        },

        set: function(transform) {
            this.batch.transform = transform
        }
    },

    ortho: function(width, height) {
        mat4.ortho(this.projection, 0, width, height, 0, 0, 1)
        this.updateUniforms()
        return this
    },

    solid: function() {
        this.batch.texture = null
        return this
    },

    image: function(image, uv) {
        this.batch.texture = image
        this.batch.texcoord = uv || TEXCOORD_DEFAULT
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

    fillRect: function(x, y, width, height) {
        this.solid().reset()
        this.rect(x, y, width, height)
        return this
    },  

    //just pushes a single quad with current attributes
    rect: function(x, y, width, height) {
        this.batch.color = this.color
        this.batch.position[0] = x||0
        this.batch.position[1] = y||0
        this.batch.shape[0] = width||0
        this.batch.shape[1] = height||0
        this.batch.push()
    },

    stroke: function(x, y, width, height, thickness) {
        this.batch.color = this.color
        thickness = number(thickness, 1)
        this.rect(x+thickness, y, width-thickness*2, thickness)
        this.rect(x, y, thickness, height)
        this.rect(x+thickness, y+height-thickness, width-thickness*2, thickness)
        this.rect(x+width-thickness, y, thickness, height)
    },

    strokeRect: function(x, y, width, height, thickness) {
        this.solid().reset()
        this.stroke(x, y, width, height, thickness)
        return this
    },

    drawImage: function(image, x, y, width, height) {
        "use strict";
        width = number(width, image.shape ? image.shape[0] : 0)
        height = number(height, image.shape ? image.shape[1] : 0)

        var uv = TEXCOORD_DEFAULT

        if (arguments.length >= 9) {
            var texSize = image.shape 
            var clipPos = copy2(tmp1, arguments[1], arguments[2])
            var clipSize = copy2(tmp2, arguments[3], arguments[4])

            //get UV coordinates, storing in our temp array as to not 
            //change constant default
            uv = texcoord(clipPos, clipSize, texSize, tmpUV)

            x = arguments[5]
            y = arguments[6]
            width = arguments[7]
            height = arguments[8]
        }

        this.reset()
        // this.batch.rotation = rotation||0
        // if (rotationOrigin)
        //     this.batch.rotationOrigin = rotationOrigin
        this.image(image, uv)
        this.rect(x, y, width, height)
        return this
    },

    sprite: function(sprite) {
        this.reset()
        this.batch.push(sprite)
        return this
    },

    updateUniforms: function() {
        this.defaultShader.bind()
        this.defaultShader.uniforms.projection = this.projection
        this.defaultShader.uniforms.view = this.view
        // this.defaultShader.uniforms.model = this.transform
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
    }
})

mixes(SpriteRenderer, require('./transforms'))

module.exports = SpriteRenderer