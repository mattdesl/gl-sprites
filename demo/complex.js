var lena = require('lena')
var baboon = require('baboon-image')
var Baktch = require('../')
var Tex = require('gl-texture2d')
var rgba = require('./rgba')
var texcoord = require('texcoord')
var CheckerTex = require('./checker')

var Lato = require('bmfont-lato/32')
var createText = require('gl-sprite-text')

require('canvas-testbed')(render, start, { 
    context: 'webgl',
    width: 400,
    height: 400
})

var renderer, tex, tex2, checker, textRenderer
var t = 0

function render(gl, width, height, dt) {
    t += dt / 1000
    gl.clearColor(0.2,0.2,0.2,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)


    renderer.bind()
    renderer.ortho(width, height)


    renderer.color = [1, 1, 1, 1]
    var size = 128,
        off = 50
    renderer.drawImage(tex2, off, off, size, size)

    //some custom shape drawing..
    border(renderer, off, off, size, size)

    renderer.color = [1, 1, 1, 0.85]
    var x = 170, y = 100
    size = 64
    renderer.save()
    renderer.translate(x, y)
    renderer.rotateY(t)
    renderer.translate(-size/2, -size/2)

    renderer.drawImage(tex, 0, 0, 256, 256, 0, 0, size, size)
    renderer.restore()

    renderer.save()
    renderer.translate(width/2, height/2)
    renderer.scale(0.5, 0.5)
    renderer.rotateZ(Math.sin(t/4)*Math.PI)

    renderer.color = [1, 1, 1, 1]
    renderer.fillRect(-50*Math.sin(t), 20, 100*Math.sin(t), 5)
    renderer.color = [1, 0.4, 0.5, 1.0]
    renderer.strokeRect(100, 10, 80, 50*Math.sin(t), 2)

    renderer.restore()

    drawText()

    renderer.unbind()
}

function drawText() {
    renderer.identity()
    renderer.color = [1,1,1,1]
    renderer.reset()
    renderer.save()

    //this is a bit low-level
    //something better may be exposed at some point.. 
    var dpr = 1/(window.devicePixelRatio||1)
    var bounds = textRenderer.getBounds()

    renderer.translate(10, 10)
    renderer.scale(dpr, dpr)
    renderer.translate(0, bounds.height)
    textRenderer.draw(renderer.batch, 0, 0)

    renderer.restore()
}

function border(renderer, x, y, width, height) {
    var r = 8
    renderer.reset() //reset attributes

    renderer.solid()
    renderer.color = [1,1,1,0.25]
    renderer.stroke(x, y, width, height, 4)

    renderer.image(checker, [-r, -r, r, r])
    renderer.color = [1,1,1,1]
    renderer.stroke(x, y, width, height, 1)
}

function start(gl, width, height) {
    renderer = Baktch(gl)
    tex = Tex(gl, baboon)
    tex2 = Tex(gl, lena)
    checker = CheckerTex(gl)
    checker.wrap = gl.REPEAT

    textRenderer = createText(gl, {
        font: Lato,
        textures: Lato.images.map(function(img) {
            return Tex(gl, img)
        }),
        text: "this is some text with Lato @ 32px!"
    })
}