import $ from 'jquery';
import _ from 'slick-carousel';
import Drift from 'drift-zoom';
import jsWidth from '../helpers/screenWidths';

const selectors = {
  zoomImage: '[js-product-gallery="zoom"]',
  zoomPane: '[js-product-gallery="zoomPane"]',
};

export default () => {

  const nodeSelectors = {
    zoomImage: document.querySelectorAll(selectors.zoomImage),
    zoomPane: document.querySelector(selectors.zoomPane),
  };

   /**
   * Options for Drift zoom.
   */
  const zoomOptions = {
    touchBoundingBox: true,
    paneContainer: nodeSelectors.zoomPane,
    zoomFactor: 2.5,
  };

  /**
   * Instance globals.
   */
  const zoomImages = {};

  function slickRender(slider, nav) {
    slider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: nav,
      touchThreshold: 30,
      lazyLoad: 'ondemand',
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            dots: true,
            arrows: true,
            prevArrow: '<div class="slick-arrow slick-prev wolf-arrow"></div>',
            nextArrow: '<div class="slick-arrow slick-next wolf-arrow wolf-arrow--right"></div>',
          },
        },
      ],
    });

    nav.slick({
      slidesToShow: 7,
      slidesToScroll: 1,
      asNavFor: slider,
      dots: false,
      arrows: true,
      prevArrow: '<div class="slick-arrow slick-prev wolf-arrow"></div>',
      nextArrow: '<div class="slick-arrow slick-next wolf-arrow wolf-arrow--right"></div>',
      centerMode: false,
      focusOnSelect: true,
      vertical: false,
      verticalSwiping: false,
      lazyLoad: 'ondemand',
    });
  }

  function slickLoop() {
    $.each($('.product-images__container'), function() {
      const slider = $(this).attr('data-slider');
      const nav = $(this).attr('data-nav');
      const $slider = $(`#${slider}`);
      const $nav = $(`#${nav}`);
      slickRender($slider, $nav);
    });
  }

  function init() {
    slickLoop();
    setZoomEvents();
  }

  function setZoomEvents() {
    const windowWidth = $(window).width();
    if(document.querySelector('.product-slider-nav')){
      const navHeight = document.querySelector('.product-slider-nav').offsetHeight;
      
      nodeSelectors.zoomPane.style.bottom = `${navHeight + 16}px`;

      if (windowWidth >= jsWidth.tablet) {
        [...nodeSelectors.zoomImage].forEach((element, index) => {
          zoomImages[index] = new Drift(element.querySelector('img'), zoomOptions);
        });
      }
    }
  }

  /**
   * Public interface.
   */
  return Object.freeze({
    init,
  });

};
