var Trianglify = require('trianglify');

const header=document.querySelector(".site-header") || document.querySelector('.post-header');
const fancyBG=document.querySelector("#fancy-bg");

const width=header.getBoundingClientRect().width;
const height=header.getBoundingClientRect().height;

fancyBG.width=width;
fancyBG.height=height;

const pattern = Trianglify({width, height});

pattern.canvas(fancyBG);
fancyBG.classList.add('visible');