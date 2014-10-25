//to reduce bundle size, we'll only grab what we need
module.exports = {
    ortho: require('gl-mat4/ortho'),
    identity: require('gl-mat4/identity'),
    create: require('gl-mat4/create'),
    scale: require('gl-mat4/scale'),
    rotateZ: require('gl-mat4/rotateZ'),
    rotateY: require('gl-mat4/rotateY'),
    rotateX: require('gl-mat4/rotateX'),
    translate: require('gl-mat4/translate'),
    clone: require('gl-mat4/clone'),
    multiply: require('gl-mat4/multiply')
}
