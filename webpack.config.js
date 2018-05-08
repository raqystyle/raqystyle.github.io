const path = require('path');

module.exports = {
  entry: './js/main.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'main.prod.js'
  }
};