import {load} from '@shopify/theme-sections';
import ProductSlider from '../sections/product-slider';
import '../sections/product';
import '../sections/product-miniform';

import '../sections/size-guide';
import SwatchProduct from '../sections/swatch-product';
document.addEventListener('DOMContentLoaded', () => {
  ProductSlider().init();
  
  if (document.querySelector('[js-swatch-product="main"]') !== null) {
    SwatchProduct({
      container: '[js-swatch-product="main"]',
      updateSlider: true,
    }).init();
  }

  if (document.querySelector('[data-section-type="product-miniform"]') !== null) {
    SwatchProduct({
      container: '[data-section-type="product-miniform"]',
      updateSlider: false,
    }).init();
  }

  load('*');
});
