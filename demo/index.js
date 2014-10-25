var clear = require('gl-clear')()
require('canvas-testbed')(render, start, { context: 'webgl' })

var baboon = require('baboon-image')
var Texture = require('gl-texture2d')
var CheckerTex = require('gl-checker-texture')
var Background = require('gl-checker-background')
var Renderer = require('../')

var renderer, 
    bg, 
    tex,
    check,
    time = 0

function render(gl, width, height, dt) {
    time += dt/1000
    clear(gl)   

    //draw some checker background tastiness 
    bg.draw()
    
    //setup renderer with 2D top-left coords
    renderer.ortho(width, height)
    renderer.begin()

    var x = 120,
        y = 100,
        w = 100,
        h = 50,
        anim = Math.sin(time)/2+0.5

    //draw an image
    renderer.color = [1, 1, 1, 1]
    renderer.drawImage(tex, 20 + anim*20, 20, anim*tex.shape[0]/2, tex.shape[1]/2)
    
    //draw some rotatin' rects
    renderer.save()
    renderer.translate(x, y)
    renderer.rotate(time)
    renderer.rotateX(time*0.8)
    renderer.translate(-w/2, -h/2)

    renderer.color = [1, anim, 0.25, 1.0]
    renderer.fillRect(0, 0, w, h)
    
    renderer.color = [0.5, 0.5, 0.5, 1.0]
    renderer.strokeRect(0, 0, w, h, anim*4)
    renderer.restore()

    dottedBorder()

    //bind renderer
    renderer.end()
}

function dottedBorder() {
    var r = 8,  
        x = 220, 
        y = 20,
        width = 100,
        height = 100

    //set default attributes
    renderer.defaults() 

    //set texture mode to "image" with specific texcoords
    renderer.image(check, [-r, -r, r, r])
    renderer.color = [0,0,0,1]

    //push a raw stroke 
    renderer.stroke(x, y, width, height, 1)
}

function start(gl, width, height) {
    renderer = Renderer(gl)
    bg = Background(gl)
    tex = Texture(gl, baboon.transpose(1, 0, 2))
    
    check = CheckerTex(gl, {
        colors: [ [0xff,0xff,0xff,0xff], [0x00,0x00,0x00,0x00] ]
    })
}