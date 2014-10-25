var mat4 = require('./mat4')
var copy3 = require('./copy').vec3
var number = require('as-number')

var tmpVec3 = [0, 0, 0]

module.exports = {

    save: function() {
        this.transformStack.push(mat4.clone(this.transform))
        return this
    },

    restore: function() {
        if (this.transformStack.length > 0) {
            var t = this.transformStack.pop()
            this.transform = t
        }
        return this
    },

    scale: function(x, y) {
        x = number(x, 1)
        y = number(y, 1)
        mat4.scale(this.transform, this.transform, copy3(tmpVec3, x, y, 1))
        return this
    },

    translate: function(x, y) {
        x = x||0
        y = y||0
        mat4.translate(this.transform, this.transform, copy3(tmpVec3, x, y, 0))
        return this
    },

    rotateZ: function(rad) {
        rad = rad||0
        mat4.rotateZ(this.transform, this.transform, rad)
        return this
    },

    rotateY: function(rad) {
        rad = rad||0
        mat4.rotateY(this.transform, this.transform, rad)
        return this
    },

    rotateX: function(rad) {
        rad = rad||0
        mat4.rotateX(this.transform, this.transform, rad)
        return this
    },

    transformMat4: function(matrix4x4) {
        mat4.multiply(this.transform, this.transform, matrix4x4)
        return this
    },

    rotate: function(rad) {
        this.rotateZ(rad)
        return this
    },

    identity: function() {
        mat4.identity(this.transform)
        return this
    }

}