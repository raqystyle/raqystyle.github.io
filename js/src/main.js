const flyd = require('flyd');
const debounceTime = require('flyd-debouncetime');
const {drawBackground} = require('./drawBackground');

const $ = document.querySelector.bind(document);

const header = $(".site-header") || $('.post-header');
const fancyBG = $("#fancy-bg");

const windowWidth$ = flyd.stream(document.body.clientWidth);
window.addEventListener('resize', windowWidth$);

const dimensions$ = debounceTime(500, windowWidth$).map(() => [
    Math.floor(header.getBoundingClientRect().width),
    Math.floor(header.getBoundingClientRect().height)
]);

flyd.combine(dimensions => {
    let [w, h] = dimensions();
    drawBackground(fancyBG, w, h);
}, [dimensions$]);