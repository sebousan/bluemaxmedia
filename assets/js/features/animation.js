import scrollspy from '../utils/scrollspy';

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
