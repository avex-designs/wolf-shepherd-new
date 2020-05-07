import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import {focusHash, bindInPageLinks} from '@shopify/theme-a11y';

import {load} from '@shopify/theme-sections';
import Navigation from '../sections/navigation';
import Search from '../sections/search-hero';
import AjaxCart from '../sections/ajax-cart';
import Instafeed from '../sections/instagram-feed';
import GiftWrap from '../sections/giftwrapping';
import QuickAdd from '../sections/quick-add';
import SwatchCollectionImage from '../sections/swatch-collection-image';
import SwatchSlider from '../sections/swatch-slider';
import VideoModal from '../sections/video-modal';

import '../sections/site-header';
import '../sections/sticky-nav';
import '../sections/featured-collection-slider';
import '../sections/collection-list';
import '../sections/list-collections';
import '../sections/collection-page';
import '../sections/features';
import '../sections/reviews';
import '../sections/testimonials';
import '../sections/seconds-slider';
import SwatchProduct from '../sections/swatch-product';

import Accordion from '../components/accordion';
import '../components/form';
import '../components/type';
import '../components/quantity';
import '../components/select';
import '../components/slide-to';
import Loadpage from '../components/loadpage';

import Article from '../snippets/article-slider';
import ArticleCollectionSlider from '../sections/article-collection-slider';

document.addEventListener('DOMContentLoaded', () => {
  Loadpage().init();
  AjaxCart().init();
  GiftWrap().init();
  QuickAdd().init();
  Navigation().init();
  Search().init();
  VideoModal();
  SwatchCollectionImage().init();
  SwatchSlider().init();

  if (document.querySelector('.accordion') !== null) {
    Accordion('.accordion', {
      singleOpen: true,
    }).init();
    Accordion('.accordion').showInitialItem();
  }

  if (document.querySelector('[js-ajax-cart="ajax-product-1"]') !== null) {
    SwatchProduct({
      container: '[js-ajax-cart="ajax-product-1"]',
      updateSlider: false,
    }).init();
  }

  if (document.querySelector('[js-ajax-cart="ajax-product-2"]') !== null) {
    SwatchProduct({
      container: '[js-ajax-cart="ajax-product-2"]',
      updateSlider: false,
    }).init();
  }

  Instafeed();

  load('*');

  // if (Shopify.theme.role == 'unpublished') {
  //   console.log(Shopify.theme);
  // }

  if (document.querySelector('.hero-image--ambassador') !== null) {
    Article().init();
    ArticleCollectionSlider().init();
  }

});

// Common a11y fixes
focusHash();
bindInPageLinks();