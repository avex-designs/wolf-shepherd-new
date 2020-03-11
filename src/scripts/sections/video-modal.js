import Player from '@vimeo/player';
import cssClasses from '../helpers/cssClasses';

/**
 * Export default exitIntent.
 */
export default () => {

  if (!document.querySelector('#modal-video')) {
    return false;
  };

  // Selectors
  const selectors = {
    container: document.querySelectorAll('[js-video-modal="container"]'),
    trigger: document.querySelectorAll('[js-video-modal="trigger"]'),
    overlay: document.querySelectorAll('[js-video-modal="overlay"]'),
    close: document.querySelectorAll('[js-video-modal="close"], .modal'),
    no_close: document.querySelectorAll('.modal__video'),
    _html: document.documentElement,
  };

  const player = new Player('modal-video');

  function init() {
    setEventListeners();
  }

  function setEventListeners() {
    selectors.trigger.forEach((item) => {
      item.addEventListener('mouseenter', modalReady);
      item.addEventListener('mouseleave', modalRelax);
      item.addEventListener('click', modalActive);
    });

    selectors.close.forEach((item) => {
      item.addEventListener('click', modalClose);
    });

    selectors.no_close.forEach((item) => {
      item.addEventListener('click', function(event){
        event.stopPropagation();
      });
    });

    selectors._html.addEventListener('keydown', handleKeydown);
  }

  function handleKeydown(ev) {
    if (ev.keyCode === 27) {
      modalClose();
    }
  }

  function modalActive(node) {
    const target = node.target.getAttribute('js-video-target');
    const modalTarget = document.querySelector(target);
    modalTarget.classList.add(cssClasses.active);
    player.play();
  }

  function modalClose() {
    const modal = document.querySelectorAll('.modal');
    modal.forEach((item) => {
      item.classList.remove(cssClasses.active);
    });
    player.pause();
  }

  function modalReady() {
    selectors.container.forEach((item) => {
      item.classList.add(cssClasses.active);
    });
  }

  function modalRelax() {
    selectors.container.forEach((item) => {
      item.classList.remove(cssClasses.active);
    });
  }

  return init();
};
