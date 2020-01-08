import $ from 'jquery';
import cssClasses from '../helpers/cssClasses';

/**
 * DOM selectors.
 */
const selectors = {
  container: '[js-product-swatches="container"]',
  productJson: '[data-product-json]',
  inventoryJson: '[data-inventory-json]',
  sizeToggle: '[js-size-toggle="trigger"]',
  $swatchColor: $('.product-form .swatch-product--color'),
  $miniSwatchOpen: $('.product-form-mini__form-toggle'),
  $miniSwatchClose: $('.product-form-mini__details__tab'),
};

/**
 * Export default AjaxCart.
 */
export default (config) => {

  const container = document.querySelector(`${config.container}`);

  const nodeSelectors = {
    container: container.querySelectorAll(selectors.container),
    productJson: container.querySelector(selectors.productJson),
    inventoryJson: container.querySelector(selectors.inventoryJson),
    sizeToggle: container.querySelectorAll(selectors.sizeToggle),
    $swatchColor: selectors.$swatchColor,
    $miniSwatchOpen: selectors.$miniSwatchOpen,
    $miniSwatchClose: selectors.$miniSwatchClose,
  };

  function init() {
    nodeSelectors.container.forEach((element) => {
      element.addEventListener('click', handleClick);
      element.addEventListener('click', swatchChange);
    });

    nodeSelectors.sizeToggle.forEach((element) => {
      element.addEventListener('click', toggleSize);
    });

    nodeSelectors.$miniSwatchOpen.on('click', openMiniSwatch);
    nodeSelectors.$miniSwatchClose.on('click', closeMiniSwatch);
  }

  function handleClick(element) {
    const target = element.target;
    if (target.dataset.swatchOption === 'option-1') {
      console.log('click');
      optionActive(target, 1);
      checkInventory(target);
      updateColorTitle(target);
      
      if (config.updateSlider === true) {
        updateSlider(target);
      }
    }
    
    if (target.dataset.swatchOption === 'option-2') {
      optionActive(target, 2);
      checkInventory(target);
      updateSizeTitle(target);
    }

    if (target.dataset.swatchOption === 'option-3') {
      optionActive(target, 3);
      checkInventory(target);
    }
  }

  function getProductJSON() {
    return JSON.parse(nodeSelectors.productJson.innerHTML);
  }

  function getVariants() {
    const productJSON = getProductJSON();
    return productJSON.variants;
  }

  function getCurrentSelected(value) {
    const option = container.querySelector(`[data-swatch-option="option-${value}"].is-active`);
    if (option === null) {
      return false;
    } else {
      const optionValue = option.dataset.swatchValue;
      return optionValue;
    }
  }

  function checkInventory() {
    const currentOption1 = getCurrentSelected(1);
    const currentOption2 = getCurrentSelected(2);
    const currentOption3 = getCurrentSelected(3);
    const inventory = getVariants();

    setSwatchesToUnavailable();

    inventory.forEach((variant) => {
      if (currentOption1 === variant.option1) {
        if (currentOption3 !== false) {
          if (currentOption3 === variant.option3) {
            updateOption2(variant);
          }
        } else if (currentOption2 !== false) {
          updateOption2(variant);
        }
      }

      if (currentOption1 === variant.option1 && currentOption2 === variant.option2) {
        if (currentOption3 !== false) {
          updateOption3(variant);
        }
      }
    });
  }

  function updateOption2(variant) {
    if (variant.available === false) {
      const target = container.querySelector(`[data-swatch-option="option-2"][data-swatch-value="${variant.option2}"]`);
      setToUnavailable(target);
    } else {
      const target = container.querySelector(`[data-swatch-option="option-2"][data-swatch-value="${variant.option2}"]`);
      setToAvailable(target);
    }
  }

  function updateOption3(variant) {
    if (variant.available === false) {
      const target = container.querySelector(`[data-swatch-option="option-3"][data-swatch-value="${variant.option3}"]`);
      setToUnavailable(target);
    } else {
      const target = container.querySelector(`[data-swatch-option="option-3"][data-swatch-value="${variant.option3}"]`);
      setToAvailable(target);
    }
  }

  function setSwatchesToUnavailable() {
    nodeSelectors.container.forEach((element) => {
      setToUnavailable(element);
    });
  }

  function setToUnavailable(element) {
    element.classList.add(cssClasses.disabled);
  }

  function setToAvailable(element) {
    element.classList.remove(cssClasses.disabled);
  }

  function optionActive(target, optionNumber) {
    container.querySelectorAll(`[data-swatch-option="option-${optionNumber}"]`).forEach((element) => {
      element.classList.remove(cssClasses.active);
    });
    target.classList.add(cssClasses.active);
  }

  function swatchChange() {
    const $this = $(this);
    const swatchValue = $this.attr('data-swatch-value');
    const swatchOption = $this.attr('data-swatch-option').replace('-', '');

    $(`${config.container} [data-index="${swatchOption}"]`).val(swatchValue).trigger('change');
  }

  function updateSlider(target) {
    const swatchValue = target.dataset.slider;

    $('.product-images__container').removeClass(cssClasses.active);
    $(`#${swatchValue}`).addClass(cssClasses.active);
  }

  function updateColorTitle(target) {
    const swatchColor = target.dataset.swatchValue;

    container.querySelector('[js-swatch="color"]').innerHTML = swatchColor;
  }

  function updateSizeTitle(target) {
    const swatchSize = target.dataset.swatchValue;

    container.querySelector('[js-swatch="size"]').innerHTML = `SIZE: ${swatchSize}`;
  }

  function openMiniSwatch() {
    const $details = $('.product-form-mini__details');
    $details.addClass(cssClasses.active);
  }

  function closeMiniSwatch() {
    const $details = $('.product-form-mini__details');
    $details.removeClass(cssClasses.active);
  }

  function toggleSize(element) {
    const target = element.target;
    const wrapper = container.querySelector('.swatch__size-container');
    if (target.classList.contains(cssClasses.active)) {
      target.classList.remove(cssClasses.active);
      wrapper.classList.remove(cssClasses.active);
    } else {
      target.classList.add(cssClasses.active);
      wrapper.classList.add(cssClasses.active);
    }
  }

  /**
   * Return immutable object.
   */
  return Object.freeze({
    init,
    closeMiniSwatch,
  });
};


