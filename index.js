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

    this._blendSrc = number(opt.blendSrc, gl.SRC_ALPHA)
    this._blendDst = number(opt.blendDst, gl.ONE_MINUS_SRC_ALPHA)
    this._blendEnabled = opt.blend !== false

    this.gl = gl
    this.shader = opt.shader || createShader(gl, {
        color: true,
        texcoord: true
    })
    this.batch = opt.batch || createBatch(gl, xtend({ 
        dynamic: true,
        premultiplied: true 
    }, opt))

    this._bound = false
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

    clear: function() {
        this.batch.clear()
        return this
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

    defaults: function() {
        this.batch.defaults()
        this.batch.color = this.color
        return this
    },

    flush: function() {
        this.batch.flush()
        return this
    },

    fillRect: function(x, y, width, height) {
        this.solid().defaults()
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
        this.solid().defaults()
        this.stroke(x, y, width, height, thickness)
        return this
    },

    fillText: function(text, x, y, start, end) {
        var oldTransform = text.batch.transform,
            oldColor = text.batch.color,
            wasBound = this._bound

        if (wasBound) { 
        //TODO: we could always assume dynamic and remove this condition
            this.draw()
            this.unbind()
            this.clear()
        }
        text.batch.color = this.color
        text.batch.transform = this.transform
        text.draw(this.shader, x, y, start, end)
        text.batch.color = oldColor
        text.batch.transform = oldTransform
        if (wasBound) {
            this.bind()
        }
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

        this.defaults()
        // this.batch.rotation = rotation||0
        // if (rotationOrigin)
        //     this.batch.rotationOrigin = rotationOrigin
        this.image(image, uv)
        this.rect(x, y, width, height)
        return this
    },

    sprite: function(sprite) {
        this.batch.push(sprite)
        return this
    },

    updateUniforms: function() {
        this.shader.bind()
        this.shader.uniforms.projection = this.projection
        this.shader.uniforms.view = this.view
    },

    bind: function() {
        var gl = this.gl
        if (this._blendEnabled) {
            gl.enable(gl.BLEND)
            gl.blendFunc(this._blendSrc, this._blendDst)
        }

        this._bound = true
        this.batch.bind(this.shader)
        this.solid()
        return this
    },

    draw: function() {
        this.batch.draw()
        return this
    },

    unbind: function() {
        this.batch.unbind()
        this._bound = false
        return this
    },

    begin: function() {
        this.bind()
        this.clear()
        return this
    },

    end: function() {
        this.draw()
        this.unbind()
        return this
    }
})

mixes(SpriteRenderer, require('./transforms'))

module.exports = SpriteRenderer