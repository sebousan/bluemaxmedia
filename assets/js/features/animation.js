import scrollspy from '../utils/scrollspy';
import Splitting from 'splitting';

const splitElements = document.querySelectorAll('.js-split');
splitElements.forEach(element => {
  Splitting({ target: element, by: 'lines' });
});

// Wait for webfonts only, not window load (which waits for the YouTube iframe and images)
const elements = document.querySelectorAll('[data-anim]');
const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
fontsReady.then(() => {
  // The theme removes it on load; transitions must be enabled for the animations
  document.body.classList.remove('preload');
  elements.forEach((elm) => {
    scrollspy(elm, () => {
      elm.dataset.animShow = true;
    });
  });
});
