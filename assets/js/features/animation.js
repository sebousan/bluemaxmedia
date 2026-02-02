import scrollspy from '../utils/scrollspy';
import Splitting from 'splitting';

const splitElements = document.querySelectorAll('.js-split');
splitElements.forEach(element => {
  Splitting({ target: element, by: 'lines' });
});

const elements = document.querySelectorAll('[data-anim]');
window.addEventListener('load', function () {
  this.setTimeout(() => {
    elements.forEach((elm) => {
      scrollspy(elm, () => {
        elm.dataset.animShow = true;
      });
    });
  }, 100);
});
