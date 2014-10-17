var colorString = require('color-string')

module.exports = function(str) {
    if (Array.isArray(str))
        return str
    else {
        var rgba = colorString.getRgba(str)
        rgba[0]/=255
        rgba[1]/=255
        rgba[2]/=255
        return rgba
    }
}