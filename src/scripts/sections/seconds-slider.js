import $ from 'jquery';
import _ from 'slick-carousel';
import {register} from '@shopify/theme-sections';
import jsWidth from '../helpers/screenWidths';

if($('#disclaimer').length){
  const sec = $('#shopify-section-seconds-slider').detach()
  sec.insertAfter('#disclaimer')
}

register('seconds-slider', {
  onLoad() {
    this.eventListeners();
  },

  eventListeners() {
    this.slickCheck();

    $(window).resize(() => {
      this.slickCheck();
    });
  },

  slickCheck() {
    this.addSlider();
    this.slickRender();
  },

  addSlider() {
    const section = this;
    const $slider = $(`.seconds-slider-main`);
    // if ($slider.hasClass('is-on') == false) {
    //   console.log('no reinit ison')

    //   $slider.slick(section.getSliderSettingsMain());
    //   $slider.addClass("is-on");
    // }
    if ($slider.hasClass('slick-initialized')) {
      $slider.slick('reinit');
    } else {
      $slider.slick(section.getSliderSettingsMain());
    }
  },

  getSliderSettingsMain() {
    return {
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: false,
      infinite: false,
      responsive: [
        {
          breakpoint: 9999,
          settings: 'unslick',
        },
        {
          breakpoint: 760,
          settings: {
            autoplay: true,
            autoplaySpeed: 4000,
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false
          },
        },
        {
          breakpoint: 500,
          settings: {
            autoplay: true,
            autoplaySpeed: 6000,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true
          },
        },
      ],
    };
  },

  slickRender() {
    const section = this;
    const $slider = $('.seconds-slide-child')
    // if ($slider.hasClass('is-on') == false) {
    //   $slider.slick(section.getSliderSettingsChild());
    //   $slider.addClass("is-on");
    // }

    if ($slider.hasClass('slick-initialized')) {
      $slider.slick('refresh');
    } else {
      $slider.slick(section.getSliderSettingsChild());
    }
  },


  getSliderSettingsChild() {
    return {
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: '<div class="arrow-left"></div>',
      nextArrow: '<div class="arrow-right"></div>',
      responsive: [
        {
          breakpoint: 500,
          settings: 'unslick'
          // settings: {
          //   infinite: false,
          //   slidesToShow: 1,
          //   slidesToScroll: 1,
          //   dots: true,
          //   arrows: false,
          // },
        }
      ]
    }
  }

});
