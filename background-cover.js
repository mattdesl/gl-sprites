var copy2 = require('./copy2')

var pos = [0, 0],
    shape = [0, 0]

module.exports = function cover(batch, texture, parent, texcoord) {
    batch.texture = texture
    
    var tShape = texture.shape
    var pAspect = parent[0] / parent[1]
    var tAspect = tShape[0] / tShape[1]

    var width,
        height,
        x = 0, y = 0

    if (tAspect > pAspect) {
        height = parent[1]
        width = height * tAspect 
    } 
    else {
        width = parent[0]
        height = width / tAspect
    }
    x = (parent[0]-width)/2
    y = (parent[1]-height)/2

    batch.position = copy2(pos, x, y)
    batch.shape = copy2(shape, width, height)

    if (texcoord)
        batch.texcoord = texcoord

    batch.push()
    return batch
}


