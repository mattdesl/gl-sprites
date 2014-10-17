var baboon = require('baboon-image')
var Baktch = require('../')
var Tex = require('gl-texture2d')
var rgba = require('./rgba')

require('canvas-testbed')(render, start, { context: 'webgl' })


var renderer, tex

function render(gl, width, height) {
    gl.clearColor(0.2,0.2,0.2,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)


    renderer.bind()
    renderer.ortho(width, height)

    renderer.solid()
    renderer.color = [1, 1, 1, 0.5]
    renderer.strokeRect([200, 200], [50, 50])
    renderer.drawLine([100, 40], [50, 25], 4)
    renderer.drawRect([20, 20], [10, 10])
    
    renderer.white()
    renderer.drawImage(tex, [50, 50], [128, 128], null, Math.PI/7, [64, 64])

    renderer.unbind()
}

function start(gl, width, height) {
    renderer = Baktch(gl)
    tex = Tex(gl, baboon)

}