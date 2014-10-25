# gl-sprites 

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A high-level 2D WebGL rendering API similar to HTML5 Canvas2D context. This is built on [gl-sprite-batch](https://nodei.co/npm/gl-sprite-batch/), which can be used alongside (or instead of) this for more performance-critical features.

It dynamically batches textured quads with a single shader. This makes it ideal for games using sprite sheets, text rendering, particle systems, etc. It uses 'source over' blending by default (`SRC_ALPHA`, `ONE_MINUS_SRC_ALPHA`), and colours are premultiplied by their alpha. It can also draw filled and stroked rectangles and line segments.

Example:

```js
var gl = require('webgl-context')()
var clear = require('gl-clear')()
var Sprites = require('gl-sprites')

var renderer = Sprites(gl)

function render(width, height) {
    clear(gl)

    renderer.ortho(width, height)
    renderer.begin()

    renderer.color = [1, 0, 0, 1]

    //assumes gl-texture2d 
    renderer.drawImage(tex, 25, 25)

    //rectangles and lines
    renderer.save()
    renderer.translate(25, 25)
    renderer.drawRect(0, 0, 15, 15)
    renderer.strokeRect(50, 50, 25, 25)
    renderer.restore()

    //assumes gl-sprite-text is being passed
    renderer.drawText(textSprite, 20, 100)
    
    renderer.end()
}

## Usage

[![NPM](https://nodei.co/npm/gl-sprites.png)](https://nodei.co/npm/gl-sprites/)

#### `sprites = createSprites(gl[, opt])`



## License

MIT, see [LICENSE.md](http://github.com/mattdesl/gl-sprites/blob/master/LICENSE.md) for details.
