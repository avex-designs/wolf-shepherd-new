/* Cart popup being displayed when the user clicks on the cart icon */

import $ from 'jquery';
import {formatMoney} from '@shopify/theme-currency';
import {misc as icons} from '../helpers/svg-map';
import FreeShipping from '../sections/free-shipping';
import Navigation from '../sections/navigation';
import cssClasses from '../helpers/cssClasses';
import swatch from '../sections/swatch-product';

/**
 * Export default AjaxCart.
 */
export default () => {

  if (theme.ajaxCart.enable === false) {
    return false;
  }

  const selectors = {
    $body: $('body'),
    $form: $('form[action="/cart/add"]'),
    $cartCount: $('.cart-icon__container, .cart-ajax__subtitle-counter'),
    $cartList: $('.cart-ajax__list'),
    $cartBody: $('.cart-ajax__wrapper'),
    $cartTotalPrice: $('.cart-ajax--total-price'),
    $cartClose: $('.cart-ajax__close'),
    $cartToggleBtn: $('#Cart-icon'),
    $subTotalClass: $('.js-cart-subtotal'),
    $cartItems: $('.js-cart-item-count'),
  };

  const cartPage = window.location.pathname;
  let cartOpened = false;

  function init() {
    setEventListeners();
  }

  function setEventListeners() {

    /* ----------------------------------------------------
    Add to cart functions
    -----------------------------------------------------*/
    selectors.$form.on('submit', function(event) {
      event.preventDefault();

      const $this = $(this);
      const formData = $this.serialize();
      const $error = $this.find('.error');
      addToCart(formData, $error);
    });

    /* ----------------------------------------------------
    change cart functions and triggers
    -----------------------------------------------------*/ 
    $(document).on('click', '.cart-ajax__remove', function() {
      const $this = $(this);
      cartValueTrigger($this, 'remove');
    });


    $(document).on('change', '.cart-ajax .quantity-wrapper input', function() {
      const $this = $(this);
      cartValueTrigger($this);
    });

    $(document).on('click', '.cart-ajax .quantity-wrapper', function() {
      const $this = $(this);
      cartValueTrigger($this);
    });

    $(document).on('click', '.cart-item__remove', function() {
      const $this = $(this);
      cartValueTrigger($this, 'remove');
    });

    $(document).on('focusout', '.cart-item__quanity .quantity-wrapper input', function() {
      const $this = $(this);
      cartValueTrigger($this);
    });

    $(document).on('click', '.cart-item__quanity .quantity-wrapper', function() {
      const $this = $(this);
      cartValueTrigger($this);
    });

    /* ----------------------------------------------------
    Cart open and close functions
    -----------------------------------------------------*/
    document.documentElement.addEventListener('keydown', handleKeydown);

    selectors.$cartToggleBtn.on('click', (event) => {
      event.preventDefault();
      cartRender();
    });

    $(document).on('mouseup', (event) => {
      if (!selectors.$cartBody.is(event.target) && selectors.$cartBody.has(event.target).length === 0) {
        cartClose();
      }
    });

    selectors.$cartClose.on('click', () => {
      cartClose();
    });

    $('.cart-ajax__background').on('click', () => {
      cartClose();
    });
  }


  function cartValueTrigger(element, remove) {
    const variantId = element.closest('.cart-data').attr('data-id');
    const lineNo = element.closest('.cart-data').attr('data-line');
    const input = element.parent().find('input');
    const sendQuantity = parseInt(input.val());

    if (remove === 'remove') {
      changeCart(lineNo, 0, variantId);
    } else {
      changeCart(lineNo, sendQuantity, variantId);
    }
  }

  function handleKeydown(event) {
    if (event.keyCode === 27) {
      cartClose();
    }
  }

  /* ----------------------------------------------------
  Below are all the functions for Add to cart, update cart and get cart data
  -----------------------------------------------------*/
  function addToCart(formData, $error) {
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: formData,
      dataType: 'json',
      beforeSend: () => {
        $error.addClass('error--hide');
      },
      success: () => {
        eventBus();
        cartRender();
      },
      error: (XMLHttpRequest) => {
        const data = eval(`(${XMLHttpRequest.responseText})`);
        const response = data.description;

        $error.html(response).removeClass('error--hide');
      },
    });
  }

  function changeCart(lineNo, quantity, variantId) {
    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: `quantity=${quantity}&line=${lineNo}`,
      dataType: 'json',
      beforeSend: () => {
        if (quantity === 0 && cartPage === '/cart') {
          $(`.cart__row--${variantId}`).fadeOut().remove();
        }
      },
      success: () => {
        eventBus();
        cartRender();
      },
    });
  }

  function getCartJSON(callback, x, y) {
    $.getJSON('/cart.js', (cart) => {
      callback(cart, x, y);
    });
  }

  /* ----------------------------------------------------
  Below are all the functions update the cart display - Ajax and cart page
  -----------------------------------------------------*/
  function cartRender() {
    if (cartPage === '/cart') {
      getCartJSON(updateLineItems);
    } else {
      getCartJSON(cartBuild);
      if (cartOpened !== true) {
        cartOpen();
      }
    }
    updateTotals();
    FreeShipping().init();
  }

  // Ajax Cart Open
  function cartOpen() {
    Navigation().removeActiveState();
    selectors.$cartClose.focus();
    selectors.$cartBody.addClass('cart-ajax--show');
    cartOpened = true;
    scrollLockDown();

    if(document.querySelector('[data-section-type="product-miniform"]') !== null ) {
      swatch({
        container: '[data-section-type="product-miniform"]',
      }).closeMiniSwatch();
    }
  }

  // Ajax Cart Close
  function cartClose() {
    selectors.$cartBody.removeClass('cart-ajax--show');
    cartOpened = false;
    scrollUnlocked();
  }

  function updateTotals() {
    getCartJSON(cartCounter);
    if (cartPage === '/cart') {
      getCartJSON(updateCartTotal);
    } else {
      getCartJSON(updateAjaxCartTotal);
      getCartJSON(updateCartTotal);
    }
  }

  function cartCounter(cart) {
    $('#CartCount, .cart-ajax__subtitle-counter').html(cart.item_count);

    if (cart.item_count === 0) {
      selectors.$cartCount.removeClass(cssClasses.active);
    } else {
      selectors.$cartCount.addClass(cssClasses.active);
    }
  }

  function updateAjaxCartTotal(cart) {
    const cartTotal = formatMoney(cart.total_price, theme.moneyFormat).replace('.00','');
    selectors.$cartTotalPrice.html(`<span class=money>${cartTotal}</span>`);
  }

  function cartBuild(cart) {
    const items = cart.items;
    selectors.$cartList.html('');

    if (items.length) {
      $.each(items, (i, item) => {
        const cartRow = createMarkup(item, i);
        selectors.$cartList.append(cartRow);
      });
      $('.cart-ajax__footer').show();
      $('.cart-ajax__giftwrapping').show();
    } else {
      $('.cart-ajax__footer').hide();
      $('.cart-ajax__giftwrapping').hide();
      const emptyCart = `
        <div class="cart-ajax__empty">
          <h3>Your bag is empty…</h3>
          <a href="/collections/shoes" class="button" title="Shop shoes">Shop shoes</a>
          <a href="/collections/accessories" title="Shop accessories" class="button">Shop accessories</a>
        </div>
      `;
      selectors.$cartList.append(emptyCart);
    }

    updateTotals();
  }

  // Gift wrapping product check
  function isGiftWrapCheck(cart) {
    if (cart.title === 'Gift Wrapping') {
      return 'cart-ajax__gift-wrap';
    } else {
      return '';
    }
  }

  // Gift wrapping product check
  function isFreeGiftCheck(cart) {
    if (cart.title.includes('Free Gift')) {
      return 'cart-ajax__free-gift';
    } else {
      return '';
    }
  }

  function createMarkup(cart, loopCount) {
    const cartVariantTitle = cart.variant_title === null ? '' : cart.variant_title;
    const cartLinePrice = formatMoney(cart.line_price, theme.moneyFormat).replace('.00','');
    const loopCounter = loopCount + 1;
    const isGiftWrap = isGiftWrapCheck(cart);
    const isFreeGift = isFreeGiftCheck(cart);

    const cartRow =  `
          <div class="cart-ajax__row cart-data ${isGiftWrap} ${isFreeGift}" data-line="${loopCounter}" data-id="${cart.id}">
            <div class="cart-ajax__row__column">
              <a href="${cart.url}" title="Product Image" class="js-click-gtm cart-ajax__row__image" style="background-image: url(${cart.image})"></a>
            </div>
            <div class="cart-ajax__row__column">
              <a href="${cart.url}" title="${cart.product_title}" class="js-click-gtm h6 cart-ajax__row__title">
                ${cart.product_title}
                <small class="cart-ajax__row__variant">${cartVariantTitle}</small>
              </a>
              <span class="cart-ajax__row__money">${cartLinePrice}</span>
              <div class="quantity-wrapper">
                <button name="Quantity decrease" type="button" class="quantity-wrapper__minus js--quantity" data-increment="false">-</button>
                <input type="number" value="${cart.quantity}" min="0">
                <button name="Quantity increment" type="button" class="quantity-wrapper__plus js--quantity" data-increment="true">+</button>
              </div>
              <button name="Remove" type="button" class="cart-ajax__remove" tabindex="0">${icons.remove}</button>
            </div>
          </div>`;

    return cartRow;
  }

  // Cart Page
  function updateCartTotal(cart) {
    $('.js-cart-item-count').html(cart.item_count);
    $('.js-cart-subtotal').html(formatMoney(cart.total_price));
  }

  function updateLineItems(cartdata) {
    $.each(cartdata.items, (i, item) => {
      const linePrice = formatMoney(item.original_line_price);
      const lineQuantity = item.quantity;
      const newLineData = i + 1;

      $(`.cart__row--${item.id} .cart__line-total`).html(linePrice);
      $(`.cart__row--${item.id} .cart-ajax__quantity__input`).val(lineQuantity);
      $(`.cart__row--${item.id} .cart-data`).attr('data-line', newLineData);
    });
  }

  /**
   * Stop site from scrolling
   */
  function scrollLockDown() {
    selectors.$body.addClass('is-lockdown');
  }

  /**
   * Remove site scrolling lock
   */
  function scrollUnlocked() {
    selectors.$body.removeClass('is-lockdown');
  }

  function eventBus() {
    $(document).trigger('Ajaxcart:success', [false]);
  }

  /**
   * Return immutable object.
   */
  return Object.freeze({
    init,
    eventBus,
    addToCart,
    cartRender,
    updateTotals,
  });
};
