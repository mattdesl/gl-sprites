var clear = require('gl-clear')()
require('canvas-testbed')(render, start, { 
    context: 'webgl',
    onResize: resize
})

var Lato = require('bmfont-lato/64')
var Text = require('gl-sprite-text')
var Texture = require('gl-texture2d')
var Background = require('gl-checker-background')
var Baktch = require('../')

var dummy = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a ante laoreet, imperdiet libero eu, egestas ipsum. Ut feugiat, lorem ut efficitur eleifend, lacus metus dignissim diam, eget ultricies felis sem ac orci.'

var renderer, 
    bg, 
    pad = 100,
    text,
    time = 0,
    DPR = window.devicePixelRatio||1

function render(gl, width, height, dt) {
    time += dt/1000
    clear(gl)   

    //draw some checker background tastiness 
    bg.draw()
    
    //setup renderer with 2D top-left coords
    renderer.ortho(width, height)
    renderer.begin()

    var bounds = text.getBounds()

    //Retina scaling needs to be handled manually.
    renderer.save()

    renderer.scale(1/DPR, 1/DPR)
    renderer.color = [0, 0, 0, 1]
    renderer.fillText(text, pad, pad+bounds.height)

    renderer.color = [0, 0, 0, 0.5]
    renderer.strokeRect(pad, pad, bounds.width, bounds.height, 4)
    renderer.restore()
    
    //bind renderer
    renderer.end()
}

function start(gl, width, height) {
    var textures = Lato.images.map(function(img) { 
        return Texture(gl, img)
    })
    renderer = Baktch(gl)
    bg = Background(gl)

    text = Text(gl, {
        font: Lato,
        text: dummy,
        textures: textures
    })

    resize(width, height)
}

function resize(width, height) {
    text.layout((width)*DPR-pad*2)
}