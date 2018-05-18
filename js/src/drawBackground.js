const Trianglify = require('trianglify');

function drawBackground(target, width, height) {
    target.classList.remove('visible'); 
    target.width=width;
    target.height=height;
    const pattern = Trianglify({width, height});
    pattern.canvas(target);
    // target.classList.add('visible'); 
}

module.exports = {
    drawBackground
}