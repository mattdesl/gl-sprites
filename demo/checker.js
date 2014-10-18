//quick way of creating a 2x2 checker pattern
var create = require('gl-texture2d')
var ndarray = require('ndarray')

var data = [
    0xff,0xff,0xff,0xff,
    0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,
    0xff,0xff,0xff,0xff
]

module.exports = function(gl) {
    //create a 2D ndarray
    var array = ndarray(new Uint8Array(data), [2, 2, 4])
    return create(gl, array)
}