# baktch

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

High level canvas-like interface for rapid prototyping in WebGL.

- hard-edge line segments
- filled and stroked rectangles
- images, sprite sheets supported
- bitmap fonts with gl-sprite-text

Successive quads using the same texture will end up in the same draw call, ideal for particle systems, chunks of text, etc. If you are constantly drawing different types (i.e. circle, then rect, then circle) you may get a performance hit due to shader switching and excessive draw calls. 

This assumes that transparency and render order is crucial and so it doesn't try to apply any sorting or Z-buffering techniques.

## Usage

[![NPM](https://nodei.co/npm/baktch.png)](https://nodei.co/npm/baktch/)

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/baktch/blob/master/LICENSE.md) for details.
