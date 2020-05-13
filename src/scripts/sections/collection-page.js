import $ from 'jquery';
import _ from 'jquery-match-height';

theme.Collection = (function() {
  $('.template-collection .collection-grid-item__match-height').matchHeight();
  // $('.swiper-slide .collection-grid-item').matchHeight();
  $('.slider-parent').slick({
    arrows: true,
    vertical: false,
    prevArrow: '<div class="slick-arrow slick-prev wolf-arrow"></div>',
    nextArrow: '<div class="slick-arrow slick-next wolf-arrow wolf-arrow--right"></div>',
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2
        },
      },
      {
        breakpoint: 748,
        settings: {
          slidesToShow: 1.3
        },
      }
    ]
  });
  
})();


